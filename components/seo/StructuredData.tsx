/** Renders one or more Schema.org JSON-LD blocks. `data` values must already
 * be safe, real data -- never fabricate ratings, reviews, prices, or facts
 * that aren't actually true of the business. */
export function StructuredData({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
