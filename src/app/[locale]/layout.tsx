import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { notFound } from 'next/navigation'

import { routing } from '@/i18n/routing'
import '../globals.css'
import ToastProvider from '@/providers/ToastProvider'

export const metadata = {
	title: 'Rest API Maker',
	description: 'Your app description'
}

interface LayoutProps {
	children: React.ReactNode
	params: Promise<{
		locale: string
	}>
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
	const { locale } = await params

	if (!routing.locales.includes(locale as any)) {
		notFound()
	}

	const messages = await getMessages()

	return (
		<html lang={locale} suppressHydrationWarning>
			<body>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem={true}
				>
					<ToastProvider>
						<NextIntlClientProvider
							messages={JSON.parse(JSON.stringify(messages))}
						>
							{children}
						</NextIntlClientProvider>
					</ToastProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
