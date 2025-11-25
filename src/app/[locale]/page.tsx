'use client';
import { redirect, useParams } from "next/navigation";

export default function HomePage() {
	const params = useParams();
	const locale = params?.locale || 'en'; // Default to 'en' if locale is not found
  	redirect(`/${locale}/dashboard`);
}
