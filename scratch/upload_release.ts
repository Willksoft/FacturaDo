import { createClient } from '@insforge/sdk';
import * as fs from 'fs';

const supabase = createClient('https://zdwuav42.us-east.insforge.app', 'ik_6c00d197d71798784cb69a5536c67fe1');
const fileBuffer = fs.readFileSync('C:/temp/facturado-release/FacturaDo Setup 1.0.0.exe');

async function upload() {
  console.log('Uploading...');
  const { data, error } = await supabase.storage.from('releases').upload('FacturaDo-Setup.exe', fileBuffer, {
    contentType: 'application/vnd.microsoft.portable-executable',
    upsert: true
  });
  if (error) {
    console.error('Upload error:', error);
  } else {
    console.log('Upload success:', data);
  }
}
upload();
