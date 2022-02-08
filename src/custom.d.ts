type RecordItem = {
  id: number;
  tag: TagItem;
  notes: string;
  type: string;
  amount: number;
  createdAt?: string;
}

type TagItem = {
  name: string;
  value: string;
}

type RootState = {
  recordList: RecordItem[];
  tagList: TagItem[];
  createRecordError: Error | null;
  addTagError: Error | null;
}

type HashTableValue = { title: string; items: RecordItem[] }

type groupedList = {
  title: string;
  items: RecordItem[];
}