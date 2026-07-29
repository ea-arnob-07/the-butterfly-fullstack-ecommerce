import { Sparkles } from 'lucide-react';

const items = [
  'Saree & Blouse',
  'Three-Piece',
  'Panjabi & Pajama',
  'Modest Wear',
  'New Arrivals',
  'Top Sale',
  'Bags & Jewellery',
  'Kids Fashion',
  'Premium Accessories',
  'Nationwide Delivery',
];

export function InfiniteFashionCarousel() {
  const repeated = [...items, ...items];
  return (
    <section className="marquee-shell" aria-label="Featured fashion categories">
      <div className="marquee-track">
        {repeated.map((item, index) => (
          <div className="marquee-item" key={`${item}-${index}`} aria-hidden={index >= items.length}>
            <Sparkles size={15} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
