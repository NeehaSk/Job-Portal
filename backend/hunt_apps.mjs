import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

async function findAppsInAnyDB() {
  await mongoose.connect(process.env.MONGODB_URL);
  const admin = mongoose.connection.db.admin();
  const dbs = (await admin.listDatabases()).databases.map(d => d.name);
  
  console.log(`Searching across ${dbs.length} databases...`);
  
  for(const dbName of dbs) {
      if (['admin', 'local', 'config'].includes(dbName)) continue;
      
      const db = mongoose.connection.useDb(dbName);
      const collections = await db.db.listCollections().toArray();
      
      for(const col of collections) {
          try {
              if (/application/i.test(col.name)) {
                  const count = await db.db.collection(col.name).countDocuments();
                  console.log(`[FIND] DB: ${dbName}, Col: ${col.name}, Count: ${count}`);
              } else if (col.name === 'users' || col.name === 'jobseekers') {
                  // Check if applications are embedded in users/jobseekers
                  const sample = await db.db.collection(col.name).findOne({ applications: { $exists: true, $not: {$size: 0} } });
                  if (sample) {
                      const total = await db.db.collection(col.name).countDocuments({ applications: { $exists: true, $not: {$size: 0} } });
                      console.log(`[EMBEDDED] DB: ${dbName}, Col: ${col.name}, Embedded in ${total} records`);
                  }
              }
          } catch(e) {}
      }
  }
  process.exit(0);
}
findAppsInAnyDB();
