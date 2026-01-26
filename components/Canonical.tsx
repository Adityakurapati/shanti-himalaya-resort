interface CanonicalProps {
  url?: string;
}

export function Canonical({ url }: CanonicalProps) {
  const canonicalUrl = url || '';
  
  return (
    <link rel="canonical" href={`https://shantihimlaya.com${canonicalUrl}`} />
  );
}
