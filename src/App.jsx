import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import PublicLayout from './components/layout/PublicLayout'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PlanGate from './components/PlanGate'
import { FEATURES } from './lib/billing'
import ScrollToTop from './components/ScrollToTop'

import Home from './pages/public/Home'
import Services from './pages/public/Services'
import Pricing from './pages/public/Pricing'
import DailyPublic from './pages/public/DailyPublic'
import ReferEarnPublic from './pages/public/ReferEarnPublic'
import Terms from './pages/public/Terms'
import Privacy from './pages/public/Privacy'
import Refund from './pages/public/Refund'
import Artists from './pages/public/Artists'
import Trending from './pages/public/Trending'
import Distribution from './pages/public/Distribution'
import PlaylistPitching from './pages/public/PlaylistPitching'
import Callertune from './pages/public/Callertune'
import SongTransfer from './pages/public/SongTransfer'
import ContentId from './pages/public/ContentId'
import Contact from './pages/public/Contact'
import Article from './pages/public/Article'
import Checkout from './pages/public/Checkout'

import Overview from './pages/Overview'
import Stats from './pages/Stats'
import Marketplace from './pages/Marketplace'
import Withdrawal from './pages/Withdrawal'
import Releases from './pages/Releases'
import Connect from './pages/Connect'
import ReferEarn from './pages/ReferEarn'
import Profile from './pages/Profile'
import PitchSong from './pages/PitchSong'
import InstaLink from './pages/InstaLink'
import ClaimRemoval from './pages/ClaimRemoval'
import ProfileMismatch from './pages/ProfileMismatch'
import YourPlan from './pages/YourPlan'

import Daily from './pages/daily/Daily'
import AiBlog from './pages/daily/AiBlog'

import SongUpload from './pages/upload/SongUpload'
import AlbumUpload from './pages/upload/AlbumUpload'
import NewSong from './pages/upload/NewSong'
import NewAlbum from './pages/upload/NewAlbum'
import TransferSong from './pages/upload/TransferSong'
import TransferAlbum from './pages/upload/TransferAlbum'
import SubmissionRules from './pages/upload/SubmissionRules'

import Help from './pages/help/Help'
import HelpAccount from './pages/help/HelpAccount'
import HelpDistribution from './pages/help/HelpDistribution'
import HelpRoyalties from './pages/help/HelpRoyalties'
import HelpTechnical from './pages/help/HelpTechnical'

import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <ScrollToTop />
      <Routes>
        {/* Public / marketing routes */}
        <Route element={<PublicLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/daily-public" element={<DailyPublic />} />
          <Route path="/refer-earn-public" element={<ReferEarnPublic />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/distribution" element={<Distribution />} />
          <Route path="/playlist-pitching" element={<PlaylistPitching />} />
          <Route path="/callertune" element={<Callertune />} />
          <Route path="/song-transfer" element={<SongTransfer />} />
          <Route path="/content-id" element={<ContentId />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/article" element={<Article />} />
        </Route>

        {/* Auth routes — standalone, no layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Dashboard routes — with right panel */}
        <Route element={<ProtectedRoute><AppLayout showRightPanel /></ProtectedRoute>}>
          <Route path="/" element={<Overview />} />
          <Route path="/releases" element={<Releases />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/refer" element={<ReferEarn />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/instalink" element={<PlanGate feature={FEATURES.INSTAGRAM_LINKING} title="Instagram linking"><InstaLink /></PlanGate>} />
          <Route path="/claim-removal" element={<ClaimRemoval />} />
          <Route path="/profile-mismatch" element={<ProfileMismatch />} />
          <Route path="/plan" element={<YourPlan />} />
          <Route path="/daily" element={<Daily />} />
          <Route path="/help" element={<Help />} />
          <Route path="/help/account" element={<HelpAccount />} />
          <Route path="/help/distribution" element={<HelpDistribution />} />
          <Route path="/help/royalties" element={<HelpRoyalties />} />
          <Route path="/help/technical" element={<HelpTechnical />} />
        </Route>

        {/* Dashboard routes — no right panel (more horizontal space) */}
        <Route element={<ProtectedRoute><AppLayout showRightPanel={false} /></ProtectedRoute>}>
          <Route path="/stats" element={<Stats />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/withdraw" element={<Withdrawal />} />
          <Route path="/daily/ai-blog" element={<AiBlog />} />
          <Route path="/upload/song" element={<SongUpload />} />
          <Route path="/upload/album" element={<AlbumUpload />} />
          <Route path="/upload/new-song" element={<PlanGate feature={FEATURES.RELEASE_SINGLE} title="Releasing a single"><NewSong /></PlanGate>} />
          <Route path="/upload/new-album" element={<PlanGate feature={FEATURES.RELEASE_ALBUM} title="Album releases"><NewAlbum /></PlanGate>} />
          <Route path="/upload/transfer-song" element={<PlanGate feature={FEATURES.TRANSFER_SINGLE} title="Song transfer & migration"><TransferSong /></PlanGate>} />
          <Route path="/upload/transfer-album" element={<PlanGate feature={FEATURES.TRANSFER_ALBUM} title="Album transfer & migration"><TransferAlbum /></PlanGate>} />
          <Route path="/submission-rules" element={<SubmissionRules />} />
          <Route path="/pitch-song" element={<PlanGate feature={FEATURES.PLAYLIST_PITCHING} title="Playlist & radio pitching"><PitchSong /></PlanGate>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
