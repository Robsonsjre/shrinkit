import '../styles/globals.css';
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { init } from "@socialgouv/matomo-next";
import Footer from '../components/Footer';

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL;
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;


// Check that PostHog is client-side (used to handle Next.js SSR)
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    // Enable debug mode in development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    }
  })
}

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    // Track page views
    const handleRouteChange = () => posthog?.capture('$pageview')
    init({ url: 'https://shrinkitaivercelapp.matomo.cloud/', siteId: 1 });
    router.events.on('routeChangeComplete', handleRouteChange)


    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  return (
    <PostHogProvider client={posthog}>
      <div className="app-wrapper bg-gray-100">
        <Component {...pageProps} />
        <Footer />
      </div>
      <style jsx global>{`
    .app-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      justify-content: space-between;

    }
    .app-wrapper > :global(.page) {
      flex: 1;
    }
  `}</style>
    </PostHogProvider>
    
  )

  
}

export default MyApp;