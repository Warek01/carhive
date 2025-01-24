import { Typography } from '@mui/material';
import { PageProps } from '@/types/next';

interface Params {
   id: string;
}

export default async function Page({ params }: PageProps<Params>) {
   const { id } = await params;

   return <Typography variant="h1">Listing {id}</Typography>;
}
