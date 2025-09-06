import { Transaction } from '@/store/slices/transactionsSlice';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

function parseCsv(content: string): Transaction[] {
  const lines = content.trim().split(/\r?\n/);
  const [header, ...rows] = lines;
  const headers = header.split(',').map((h) => h.trim());
  const idx = (k: string) => headers.indexOf(k);

  return rows.map((row) => {
    const cols = row.split(',');
    return {
      id: cols[idx('id')],
      date: cols[idx('date')],
      description: cols[idx('description')],
      category: cols[idx('category')],
      amount: Number(cols[idx('amount')]),
      type: cols[idx('type')] as 'expense' | 'income',
      source: cols[idx('source')] as 'manual' | 'bank' | 'receipt',
      merchant: cols[idx('merchant')],
    };
  });
}

export async function loadTransactionsFromCsv(assetModule: any): Promise<Transaction[]> {
  const asset = Asset.fromModule(assetModule);
  await asset.downloadAsync();
  const fileUri = asset.localUri ?? asset.uri;
  const content = await FileSystem.readAsStringAsync(fileUri!, { encoding: FileSystem.EncodingType.UTF8 });
  return parseCsv(content);
}


