export function getIdForRow(row: any) {
  if (row.id === undefined && row.data.id === undefined) {
    throw new Error('Could not find id in row.');
  } else if (row.id != null) {
    return row.id as string;
  }

  return row.data.id as string;
}
