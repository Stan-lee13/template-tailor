import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";

import Index from "./pages/Index.tsx";
import Privacy from "./pages/Privacy.tsx";

import Terms from "./pages/Terms.tsx";
import Cookies from "./pages/Cookies.tsx";
import ThankYou from "./pages/ThankYou.tsx";
import NotFound from "./pages/NotFound.tsx";

import EcommerceBrands from "./pages/solutions/EcommerceBrands.tsx";
import Retail from "./pages/solutions/Retail.tsx";
import Publishers from "./pages/solutions/Publishers.tsx";
import CaseStudies from "./pages/CaseStudies.tsx";
import Integrations from "./pages/Integrations.tsx";
import About from "./pages/About.tsx";
import Careers from "./pages/Careers.tsx";
import Contact from "./pages/Contact.tsx";
import Partners from "./pages/Partners.tsx";
import Compliance from "./pages/Compliance.tsx";
import CcpaOptOut from "./pages/legal/CcpaOptOut.tsx";
import PrivacyChoices from "./pages/legal/PrivacyChoices.tsx";
import DatabaseOptOut from "./pages/legal/DatabaseOptOut.tsx";

import BlogIndex from "./pages/blog/BlogIndex.tsx";
import BlogPost from "./pages/blog/BlogPost.tsx";

import StudioLogin from "./pages/studio/Login.tsx";
import StudioPending from "./pages/studio/Pending.tsx";
import StudioDashboard from "./pages/studio/Dashboard.tsx";
import PostsList from "./pages/studio/PostsList.tsx";
import PostEditor from "./pages/studio/PostEditor.tsx";
import Approvals from "./pages/studio/Approvals.tsx";
import SiteSettings from "./pages/studio/SiteSettings.tsx";
import NavigationEditor from "./pages/studio/NavigationEditor.tsx";
import PagesEditor from "./pages/studio/PagesEditor.tsx";
import MediaLibrary from "./pages/studio/MediaLibrary.tsx";
import ActivityLog from "./pages/studio/ActivityLog.tsx";
import SiteEditor from "./pages/studio/SiteEditor.tsx";
import VisualEditor from "./pages/studio/VisualEditor.tsx";
import TemplatesLibrary from "./pages/studio/TemplatesLibrary.tsx";
import AnnouncementBar from "./components/AnnouncementBar";

import { BookingProvider } from "./hooks/useBooking";
import BookingModal from "./components/BookingModal";
import CookieConsent from "./components/CookieConsent";
import { AuthProvider, RequireStaff, RequireAdmin } from "./hooks/useAuth";
import { StudioAIProvider } from "./hooks/useStudioAI";
import { initAnalytics } from "./lib/analytics";


const queryClient = new QueryClient();

function AppShell() {
  useEffect(() => { initAnalytics(); }, []);
  return (
    <>
      <AnnouncementBar />
      <Routes>
        <Route path="/" element={<Index />} />
        {/* Insights → Blog (permanent redirect, preserves old inbound links) */}
        <Route path="/insights" element={<Navigate to="/blog" replace />} />
        <Route path="/insights/:slug" element={<InsightsSlugRedirect />} />

        <Route path="/blog" element={<BlogIndex />} />

        <Route path="/blog/:slug" element={<BlogPost />} />

        <Route path="/solutions/ecommerce-brands" element={<EcommerceBrands />} />
        <Route path="/solutions/retail" element={<Retail />} />
        <Route path="/solutions/publishers" element={<Publishers />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/compliance" element={<Compliance />} />

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/legal/ccpa-opt-out" element={<CcpaOptOut />} />
        <Route path="/legal/privacy-choices" element={<PrivacyChoices />} />
        <Route path="/legal/database-opt-out" element={<DatabaseOptOut />} />

        <Route path="/thank-you" element={<ThankYou />} />

        {/* Hidden Team Portal */}
        <Route path="/studio/login" element={<StudioLogin />} />
        <Route path="/studio/pending" element={<StudioPending />} />
        <Route path="/studio" element={<RequireStaff><StudioAIProvider><StudioDashboard /></StudioAIProvider></RequireStaff>} />
        <Route path="/studio/posts" element={<RequireStaff><StudioAIProvider><PostsList /></StudioAIProvider></RequireStaff>} />
        <Route path="/studio/posts/new" element={<RequireStaff><StudioAIProvider><PostEditor /></StudioAIProvider></RequireStaff>} />
        <Route path="/studio/posts/:id" element={<RequireStaff><StudioAIProvider><PostEditor /></StudioAIProvider></RequireStaff>} />
        <Route path="/studio/approvals" element={<RequireStaff><RequireAdmin><StudioAIProvider><Approvals /></StudioAIProvider></RequireAdmin></RequireStaff>} />
        <Route path="/studio/settings" element={<RequireStaff><RequireAdmin><StudioAIProvider><SiteSettings /></StudioAIProvider></RequireAdmin></RequireStaff>} />
        <Route path="/studio/navigation" element={<RequireStaff><RequireAdmin><StudioAIProvider><NavigationEditor /></StudioAIProvider></RequireAdmin></RequireStaff>} />
        <Route path="/studio/pages" element={<RequireStaff><StudioAIProvider><PagesEditor /></StudioAIProvider></RequireStaff>} />
        <Route path="/studio/media" element={<RequireStaff><StudioAIProvider><MediaLibrary /></StudioAIProvider></RequireStaff>} />
        <Route path="/studio/activity" element={<RequireStaff><RequireAdmin><StudioAIProvider><ActivityLog /></StudioAIProvider></RequireAdmin></RequireStaff>} />
        <Route path="/studio/site" element={<RequireStaff><StudioAIProvider><SiteEditor /></StudioAIProvider></RequireStaff>} />
        <Route path="/studio/visual" element={<RequireStaff><StudioAIProvider><VisualEditor /></StudioAIProvider></RequireStaff>} />
        <Route path="/studio/templates" element={<RequireStaff><StudioAIProvider><TemplatesLibrary /></StudioAIProvider></RequireStaff>} />


        <Route path="*" element={<NotFound />} />
      </Routes>
      <BookingModal />
      <CookieConsent />
    </>
  );
}

function InsightsSlugRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/blog/${slug ?? ''}`} replace />;
}


const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <BookingProvider>
              <AppShell />
            </BookingProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
