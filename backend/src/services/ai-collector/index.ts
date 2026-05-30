import nodeCron from 'node-cron';
import OpenAI from 'openai';
import { chromium } from 'playwright';
import logger from '../../utils/logger';
import { generateSlug } from '../../utils/helpers';
import { Company, CollectionLog, StateInfo } from '../../models';

interface CollectedCompany {
  name: string;
  industry?: string;
  state: string;
  city?: string;
  address?: string;
  email?: string;
  website?: string;
  phone?: string;
  description?: string;
  departments?: string[];
  internshipAvailable?: boolean;
  internshipType?: string;
  sourceUrl?: string;
}

const SEARCH_SOURCES = [
  'https://www.google.com/search?q=',
  'https://www.businesslist.com.ng/search?q=',
  'https://ng.linkedin.com/search/results/companies/?keywords=',
];

const INDUSTRIES = [
  'Technology', 'Banking & Finance', 'Telecommunications', 'Manufacturing',
  'Oil & Gas', 'Healthcare', 'Education', 'Agriculture', 'Construction',
  'Media & Communications', 'Real Estate', 'Transportation & Logistics',
  'Hospitality & Tourism', 'Energy & Utilities', 'Consulting',
];

export class AICollector {
  private isRunning = false;
  private cronJob: nodeCron.ScheduledTask | null = null;
  private openai: OpenAI | null = null;

  constructor() {
    this.initOpenAI();
  }

  private initOpenAI() {
    const key = process.env.OPENAI_API_KEY;
    if (key && key !== 'your-openai-api-key-here') {
      this.openai = new OpenAI({ apiKey: key });
      logger.info('OpenAI client initialized for AI collector');
    } else {
      logger.warn('OPENAI_API_KEY not set. AI collector will run in crawl-only mode (no AI extraction).');
    }
  }

  async startScheduler() {
    const cronExpression = process.env.AI_COLLECTOR_CRON || '0 */6 * * *';
    const enabled = process.env.AI_COLLECTOR_ENABLED === 'true';

    if (!enabled) {
      logger.info('AI collector scheduler is disabled');
      return;
    }

    this.cronJob = nodeCron.schedule(cronExpression, () => {
      this.runCollectionCycle().catch((err) =>
        logger.error('Scheduled collection cycle failed', { error: err.message })
      );
    });

    logger.info(`AI collector scheduler started with cron: ${cronExpression}`);
  }

  async runCollectionCycle(): Promise<void> {
    if (this.isRunning) {
      logger.warn('Collection cycle already in progress, skipping');
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();

    const log = await CollectionLog.create({
      source: 'AI_CRAWL',
      status: 'RUNNING',
      startedAt: new Date(),
    });

    try {
      const states = await StateInfo.find().sort({ name: 1 });
      let totalAdded = 0;
      let totalUpdated = 0;
      let totalDuplicates = 0;
      let totalErrors = 0;

      const browser = await chromium.launch({ headless: true }).catch(() => null);

      const batchSize = 2;
      for (let i = 0; i < states.length; i += batchSize) {
        const batch = states.slice(i, i + batchSize);
        const results = await Promise.allSettled(
          batch.map((state) => this.collectForState(state.name, browser))
        );

        for (const result of results) {
          if (result.status === 'fulfilled') {
            const { added, updated, duplicates, errors } = result.value;
            totalAdded += added;
            totalUpdated += updated;
            totalDuplicates += duplicates;
            totalErrors += errors;
          } else {
            totalErrors++;
            logger.error('State collection failed', { error: result.reason?.message });
          }
        }
      }

      if (browser) await browser.close().catch(() => {});

      await CollectionLog.findByIdAndUpdate(log._id, {
        status: 'COMPLETED',
        completedAt: new Date(),
        duration: Date.now() - startTime,
        companiesAdded: totalAdded,
        companiesUpdated: totalUpdated,
        duplicatesFound: totalDuplicates,
        errors: totalErrors,
      });

      logger.info(
        `Collection cycle complete: +${totalAdded} added, ${totalUpdated} updated, ${totalDuplicates} duplicates, ${totalErrors} errors`
      );
    } catch (error: any) {
      await CollectionLog.findByIdAndUpdate(log._id, {
        status: 'FAILED',
        completedAt: new Date(),
        duration: Date.now() - startTime,
        message: error.message,
      });
      logger.error('Collection cycle failed', { error: error.message });
    } finally {
      this.isRunning = false;
    }
  }

  private async collectForState(state: string, browser: any) {
    let added = 0;
    let updated = 0;
    let duplicates = 0;
    let errors = 0;

    try {
      const companies = await this.searchCompaniesForState(state, browser);

      for (const company of companies) {
        try {
          const result = await this.storeCompany(company, state);
          if (result === 'added') added++;
          else if (result === 'updated') updated++;
          else if (result === 'duplicate') duplicates++;
        } catch {
          errors++;
        }
      }
    } catch (error: any) {
      logger.error(`Collection error for ${state}`, { error: error.message });
      errors++;
    }

    return { added, updated, duplicates, errors };
  }

  private async searchCompaniesForState(state: string, browser: any): Promise<CollectedCompany[]> {
    const companies: CollectedCompany[] = [];

    const searchQueries = INDUSTRIES.map(
      (industry) => `${industry} companies in ${state} Nigeria internship SIWES industrial training`
    );

    for (const query of searchQueries.slice(0, 3)) {
      try {
        const results = await this.crawlAndExtract(query, state, browser);
        companies.push(...results);
      } catch (error: any) {
        logger.debug(`Crawl failed for query: ${query}`, { error: error.message });
      }
    }

    const enriched = await this.enrichWithAI(companies, state);
    return this.deduplicateAndMerge(enriched);
  }

  private async crawlAndExtract(query: string, state: string, browser: any): Promise<CollectedCompany[]> {
    const results: CollectedCompany[] = [];

    if (!browser) {
      const encoded = encodeURIComponent(query);
      results.push({
        name: this.fallbackExtractName(query),
        industry: this.fallbackExtractIndustry(query),
        state,
        sourceUrl: `https://www.google.com/search?q=${encoded}`,
        departments: ['Computer Science', 'Business Administration', 'Engineering'],
        internshipAvailable: true,
      });
      return results;
    }

    try {
      const page = await browser.newPage();
      await page.setDefaultTimeout(15000);

      const encoded = encodeURIComponent(query);
      await page.goto(`https://www.google.com/search?q=${encoded}&num=10`, {
        waitUntil: 'domcontentloaded',
        timeout: 15000,
      }).catch(() => {});

      await page.waitForTimeout(2000);

      const snippets = await page.evaluate(() => {
        const items: string[] = [];
        const results = document.querySelectorAll('div[data-sokoban-container], div.g');
        results.forEach((el) => {
          const text = (el as HTMLElement).innerText || '';
          if (text.length > 30) items.push(text.slice(0, 800));
        });
        return items.slice(0, 5);
      }).catch(() => []);

      for (const snippet of snippets) {
        const name = this.guessCompanyName(snippet);
        if (name && name.length > 1 && !name.toLowerCase().includes('cookie') && !name.toLowerCase().includes('sign in')) {
          results.push({
            name,
            state,
            sourceUrl: `https://www.google.com/search?q=${encoded}`,
            description: snippet.slice(0, 300),
            departments: ['Computer Science', 'Business Administration', 'Engineering'],
            internshipAvailable: true,
          });
        }
      }

      await page.close().catch(() => {});
    } catch (error: any) {
      logger.debug(`Page crawl error: ${error.message}`);
    }

    return results;
  }

  private guessCompanyName(snippet: string): string | null {
    const lines = snippet.split('\n').filter((l) => l.trim());
    for (const line of lines.slice(0, 3)) {
      const trimmed = line.trim();
      if (
        trimmed.length > 3 &&
        trimmed.length < 100 &&
        /[A-Z]/.test(trimmed) &&
        !trimmed.startsWith('http') &&
        !trimmed.includes('...')
      ) {
        return trimmed.replace(/[|•·●–\-].*$/, '').trim();
      }
    }
    return null;
  }

  private async enrichWithAI(companies: CollectedCompany[], state: string): Promise<CollectedCompany[]> {
    if (!this.openai || companies.length === 0) return companies;

    const enriched: CollectedCompany[] = [];

    for (const company of companies) {
      try {
        const prompt = `You are a data extraction assistant for a Nigerian internship placement platform.

Extract structured information from this raw data about a company in ${state}, Nigeria.

Raw data: ${company.description || company.name}

Return a JSON object with these fields (use null if unknown):
{
  "name": "full company name",
  "industry": "one of: Technology, Banking & Finance, Telecommunications, Manufacturing, Oil & Gas, Healthcare, Education, Agriculture, Construction, Media & Communications, Real Estate, Transportation & Logistics, Hospitality & Tourism, Energy & Utilities, Consulting, Government, Other",
  "city": "city in ${state}",
  "address": "full address if available",
  "email": "email if available",
  "website": "website URL if available",
  "phone": "phone number if available",
  "description": "a 1-2 sentence description of what this company does",
  "departments": ["list", "of", "departments", "they", "might", "accept", "for", "internship", "e.g. Computer Science, Accounting, etc."],
  "internshipAvailable": true/false
}`;

        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 500,
          response_format: { type: 'json_object' },
        });

        const text = response.choices[0]?.message?.content;
        if (text) {
          const parsed = JSON.parse(text);
          enriched.push({
            ...company,
            name: parsed.name || company.name,
            industry: parsed.industry || company.industry,
            city: parsed.city || company.city,
            address: parsed.address || company.address,
            email: parsed.email || company.email,
            website: parsed.website || company.website,
            phone: parsed.phone || company.phone,
            description: parsed.description || company.description,
            departments: parsed.departments || company.departments,
            internshipAvailable: parsed.internshipAvailable ?? company.internshipAvailable,
            sourceUrl: company.sourceUrl,
          });
        } else {
          enriched.push(company);
        }
      } catch (error: any) {
        logger.debug(`AI enrichment failed for ${company.name}`, { error: error.message });
        enriched.push(company);
      }
    }

    return enriched;
  }

  private fallbackExtractName(query: string): string {
    const parts = query.split(' in ');
    return parts[0] || 'Unknown Company';
  }

  private fallbackExtractIndustry(query: string): string | undefined {
    const parts = query.split(' in ');
    return parts[0] || undefined;
  }

  private deduplicateAndMerge(companies: CollectedCompany[]): CollectedCompany[] {
    const seen = new Map<string, CollectedCompany>();
    for (const company of companies) {
      const cleanName = company.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
      if (!cleanName || cleanName.length < 3) continue;
      const key = `${cleanName}|${company.state.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.set(key, company);
      }
    }
    return Array.from(seen.values());
  }

  private async storeCompany(company: CollectedCompany, state: string): Promise<'added' | 'updated' | 'duplicate'> {
    const existing = await Company.findOne({
      name: { $regex: `^${this.escapeRegex(company.name)}$`, $options: 'i' },
      state: { $regex: `^${this.escapeRegex(state)}$`, $options: 'i' },
    });

    if (existing) {
      if (existing.source === 'AI_CRAWL') {
        await Company.findByIdAndUpdate(existing._id, {
          industry: company.industry,
          city: company.city,
          address: company.address,
          email: company.email,
          website: company.website,
          phone: company.phone,
          description: company.description,
          departments: company.departments || [],
          internshipAvailable: company.internshipAvailable ?? false,
          sourceUrl: company.sourceUrl,
          updatedAt: new Date(),
        });
        return 'updated';
      }
      return 'duplicate';
    }

    await Company.create({
      name: company.name,
      slug: generateSlug(company.name),
      industry: company.industry,
      state,
      city: company.city,
      address: company.address,
      email: company.email,
      website: company.website,
      phone: company.phone,
      description: company.description,
      departments: company.departments || [],
      internshipAvailable: company.internshipAvailable ?? false,
      internshipType: company.internshipType,
      source: 'AI_CRAWL',
      status: 'PENDING',
      verificationStatus: 'UNVERIFIED',
      sourceUrl: company.sourceUrl,
      collectedAt: new Date(),
    });

    return 'added';
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async triggerManualScan(states?: string[]) {
    if (this.isRunning) throw new Error('Collection cycle already in progress');

    if (states && states.length > 0) {
      const startTime = Date.now();
      let totalAdded = 0;
      const browser = await chromium.launch({ headless: true }).catch(() => null);

      for (const state of states) {
        const result = await this.collectForState(state, browser);
        totalAdded += result.added;
      }

      if (browser) await browser.close().catch(() => {});
      return { added: totalAdded, duration: Date.now() - startTime };
    }

    await this.runCollectionCycle();
    return { message: 'Full collection cycle triggered' };
  }

  async getStatus() {
    const lastLog = await CollectionLog.findOne().sort({ startedAt: -1 });
    return {
      isRunning: this.isRunning,
      lastRun: lastLog,
      collectorEnabled: process.env.AI_COLLECTOR_ENABLED === 'true',
      aiAvailable: this.openai !== null,
    };
  }

  stop() {
    if (this.cronJob) this.cronJob.stop();
    this.isRunning = false;
  }
}

export const aiCollector = new AICollector();
