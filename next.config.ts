import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
	reactCompiler: true,
	images: {
		domains: ["rest-api-maker-app.samiulbashar.site"],
	},
};

export default withNextIntl(nextConfig);

