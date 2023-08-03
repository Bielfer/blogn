import { NextResponse } from 'next/server';

export const GET = async (request: Request) => {
  return NextResponse.json({ cu: 'cu' });
};

export const POST = async (request: Request) => {
  const res = await request.json();
  return NextResponse.json({ res });
};
