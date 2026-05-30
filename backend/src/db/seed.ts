import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../models/connection';
import { StateInfo } from '../models/StateInfo';
import { Company } from '../models/Company';
import { generateSlug } from '../utils/helpers';
import { SEED_COMPANIES } from '../data/companies';

const NIGERIAN_STATES = [
  { name: 'Abia', code: 'AB', capital: 'Umuahia', region: 'South-East' },
  { name: 'Adamawa', code: 'AD', capital: 'Yola', region: 'North-East' },
  { name: 'Akwa Ibom', code: 'AK', capital: 'Uyo', region: 'South-South' },
  { name: 'Anambra', code: 'AN', capital: 'Awka', region: 'South-East' },
  { name: 'Bauchi', code: 'BA', capital: 'Bauchi', region: 'North-East' },
  { name: 'Bayelsa', code: 'BY', capital: 'Yenagoa', region: 'South-South' },
  { name: 'Benue', code: 'BE', capital: 'Makurdi', region: 'North-Central' },
  { name: 'Borno', code: 'BO', capital: 'Maiduguri', region: 'North-East' },
  { name: 'Cross River', code: 'CR', capital: 'Calabar', region: 'South-South' },
  { name: 'Delta', code: 'DT', capital: 'Asaba', region: 'South-South' },
  { name: 'Ebonyi', code: 'EB', capital: 'Abakaliki', region: 'South-East' },
  { name: 'Edo', code: 'ED', capital: 'Benin City', region: 'South-South' },
  { name: 'Ekiti', code: 'EK', capital: 'Ado Ekiti', region: 'South-West' },
  { name: 'Enugu', code: 'EN', capital: 'Enugu', region: 'South-East' },
  { name: 'FCT', code: 'FC', capital: 'Abuja', region: 'North-Central' },
  { name: 'Gombe', code: 'GO', capital: 'Gombe', region: 'North-East' },
  { name: 'Imo', code: 'IM', capital: 'Owerri', region: 'South-East' },
  { name: 'Jigawa', code: 'JI', capital: 'Dutse', region: 'North-West' },
  { name: 'Kaduna', code: 'KD', capital: 'Kaduna', region: 'North-West' },
  { name: 'Kano', code: 'KN', capital: 'Kano', region: 'North-West' },
  { name: 'Katsina', code: 'KT', capital: 'Katsina', region: 'North-West' },
  { name: 'Kebbi', code: 'KE', capital: 'Birnin Kebbi', region: 'North-West' },
  { name: 'Kogi', code: 'KO', capital: 'Lokoja', region: 'North-Central' },
  { name: 'Kwara', code: 'KW', capital: 'Ilorin', region: 'North-Central' },
  { name: 'Lagos', code: 'LA', capital: 'Ikeja', region: 'South-West' },
  { name: 'Nasarawa', code: 'NA', capital: 'Lafia', region: 'North-Central' },
  { name: 'Niger', code: 'NI', capital: 'Minna', region: 'North-Central' },
  { name: 'Ogun', code: 'OG', capital: 'Abeokuta', region: 'South-West' },
  { name: 'Ondo', code: 'ON', capital: 'Akure', region: 'South-West' },
  { name: 'Osun', code: 'OS', capital: 'Oshogbo', region: 'South-West' },
  { name: 'Oyo', code: 'OY', capital: 'Ibadan', region: 'South-West' },
  { name: 'Plateau', code: 'PL', capital: 'Jos', region: 'North-Central' },
  { name: 'Rivers', code: 'RI', capital: 'Port Harcourt', region: 'South-South' },
  { name: 'Sokoto', code: 'SO', capital: 'Sokoto', region: 'North-West' },
  { name: 'Taraba', code: 'TA', capital: 'Jalingo', region: 'North-East' },
  { name: 'Yobe', code: 'YO', capital: 'Damaturu', region: 'North-East' },
  { name: 'Zamfara', code: 'ZA', capital: 'Gusau', region: 'North-West' },
];

async function main() {
  await connectDB();

  console.log('Seeding states...');
  for (const state of NIGERIAN_STATES) {
    await StateInfo.findOneAndUpdate(
      { code: state.code },
      { $setOnInsert: state },
      { upsert: true, new: true }
    );
  }
  console.log(`  ${NIGERIAN_STATES.length} states seeded`);

  console.log('Seeding companies...');
  let created = 0;
  let skipped = 0;

  for (const company of SEED_COMPANIES) {
    const existing = await Company.findOne({
      name: { $regex: `^${company.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
      state: company.state,
    });

    if (!existing) {
      await Company.create({
        ...company,
        slug: generateSlug(company.name),
        source: 'MANUAL',
        status: 'APPROVED',
        verificationStatus: 'VERIFIED',
        departments: company.departments || [],
        internshipAvailable: company.internshipAvailable ?? false,
        collectedAt: new Date(),
      });
      created++;
    } else {
      skipped++;
    }
  }

  console.log(`  ${created} companies created, ${skipped} duplicates skipped`);
  console.log('');
  console.log('Seed complete!');
  console.log('');
  console.log('Sample companies by state:');
  const states = [...new Set(SEED_COMPANIES.map((c) => c.state))].sort();
  for (const state of states) {
    const count = SEED_COMPANIES.filter((c) => c.state === state).length;
    console.log(`  ${state}: ${count} companies`);
  }
  console.log(`  TOTAL: ${SEED_COMPANIES.length} companies across ${states.length} states`);

  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
