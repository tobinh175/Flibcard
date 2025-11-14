import LandingHero from '~/components/LandingHero';
import FlipCard from '~/components/FlipCard';
import styles from '~/styles/landing.css?url';

export const links = () => [{ rel: 'stylesheet', href: styles }];

export default function Landing() {
  return (
    <main>
      <LandingHero />
      <FlipCard />
    </main>
  );
}
