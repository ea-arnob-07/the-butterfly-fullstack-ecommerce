const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf-8');

// 1. Change provider to sqlite
schema = schema.replace('provider = "postgresql"', 'provider = "sqlite"');
schema = schema.replace('url      = env("DATABASE_URL")', 'url      = "file:./dev.db"');

// 2. Remove enums and replace their usages with String
const enums = ['Role', 'GenderSegment', 'OrderStatus', 'PaymentMethod', 'PaymentStatus', 'DeliveryZone', 'MobileBankingProvider', 'OtpPurpose'];
for (const e of enums) {
  const regex = new RegExp('enum ' + e + ' \\{[^}]+\\}', 'g');
  schema = schema.replace(regex, '');
  
  // Replace the type in models
  const typeRegex = new RegExp('([a-zA-Z]+)\\s+' + e + '(\\?)?(\\s*(@default\\([^)]+\\))?)', 'g');
  schema = schema.replace(typeRegex, (match, fieldName, optional, rest) => {
    return fieldName + ' String' + (optional || '') + (rest ? rest : '');
  });
}

// 3. Change Decimal to Float and remove @db.Decimal
schema = schema.replace(/Decimal\?/g, 'Float?');
schema = schema.replace(/Decimal/g, 'Float');
schema = schema.replace(/@db\.Float\(\d+,\s*\d+\)/g, ''); // In case it replaced Decimal inside @db.Decimal
schema = schema.replace(/@db\.Decimal\(\d+,\s*\d+\)/g, ''); 

// 4. Also fix `@default(CUSTOMER)` to `@default("CUSTOMER")` etc if any unquoted defaults exist
const enumDefaults = [
  'CUSTOMER', 'PENDING', 'UNPAID', 'CASH_ON_DELIVERY', 'CARD', 'MOBILE_BANKING',
  'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED',
  'WOMEN', 'MEN', 'CHILDREN', 'UNISEX', 'INSIDE_DHAKA', 'OUTSIDE_DHAKA', 'BKASH', 'NAGAD', 'ROCKET', 'EMAIL_VERIFICATION'
];
for (const val of enumDefaults) {
  const regex = new RegExp('@default\\(' + val + '\\)', 'g');
  schema = schema.replace(regex, '@default("' + val + '")');
}

fs.writeFileSync('prisma/schema.prisma', schema);
console.log('Schema updated for SQLite.');
