"""One-off generator: sample 200 pub drinks Excel for import testing."""
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Font

FIELDS = [
    'jina_la_bidhaa', 'namba', 'maelezo', 'kundi', 'aina', 'chapa', 'wasambazaji',
    'vipimo_jum', 'vipimo_reja', 'uwiano', 'idadi_jumla', 'idadi_reja',
    'bei_kununua', 'bei_kuuza', 'bei_kuuza_jum', 'barcode', 'huduma',
    'kielelezo', 'rangi_model', 'size', 'picha',
]

HEADERS = {
    'jina_la_bidhaa': 'Jina la Bidhaa*',
    'namba': 'Namba',
    'maelezo': 'Maelezo',
    'kundi': 'Kundi',
    'aina': 'Aina',
    'chapa': 'Chapa',
    'wasambazaji': 'Wasambazaji',
    'vipimo_jum': 'Vipimo Jumla*',
    'vipimo_reja': 'Vipimo Reja',
    'uwiano': 'Uwiano (vipimo kwa jumla)',
    'idadi_jumla': 'Idadi Jumla',
    'idadi_reja': 'Idadi Reja',
    'bei_kununua': 'Bei Kununua*',
    'bei_kuuza': 'Bei Kuuza',
    'bei_kuuza_jum': 'Bei Kuuza Jumla',
    'barcode': 'Bar Code',
    'huduma': 'Huduma (N/Y)',
    'kielelezo': 'Kielelezo (Rangi/Nyingine)',
    'rangi_model': 'Rangi/Model',
    'size': 'Size/Ukubwa',
    'picha': 'Picha (jina la faili)',
}


def row(name, code, group, cat, brand, buy, sell, unit='pc', desc='', stock=24):
    return {
        'jina_la_bidhaa': name,
        'namba': code,
        'maelezo': desc or name,
        'kundi': group,
        'aina': cat,
        'chapa': brand,
        'wasambazaji': '',
        'vipimo_jum': 'crate' if unit == 'bottle' and cat == 'Bia' else 'pc',
        'vipimo_reja': 'bottle' if unit == 'bottle' else 'pc',
        'uwiano': 24 if unit == 'bottle' and cat == 'Bia' else 1,
        'idadi_jumla': 1 if unit == 'bottle' and cat == 'Bia' else 0,
        'idadi_reja': stock if not (unit == 'bottle' and cat == 'Bia') else 0,
        'bei_kununua': buy,
        'bei_kuuza': sell,
        'bei_kuuza_jum': buy * 24 if unit == 'bottle' and cat == 'Bia' else sell,
        'barcode': '',
        'huduma': 'N',
        'kielelezo': '',
        'rangi_model': '',
        'size': '',
        'picha': '',
    }


def build_items():
    items = []
    n = 1

    # --- Local / regional beers ---
    beers = [
        ('Safari Lager 500ml', 'Tanzania Breweries', 2200, 3500),
        ('Kilimanjaro Premium 500ml', 'Tanzania Breweries', 2300, 3500),
        ('Serengeti Lager 500ml', 'Serengeti Breweries', 2200, 3500),
        ('Serengeti Premium Lager 500ml', 'Serengeti Breweries', 2400, 3800),
        ('Ndovu Special Lager 500ml', 'Tanzania Breweries', 2100, 3200),
        ('Castle Lager 500ml', 'AB InBev', 2500, 4000),
        ('Castle Lite 330ml', 'AB InBev', 2300, 3800),
        ('Castle Milk Stout 500ml', 'AB InBev', 2600, 4200),
        ('Heineken 330ml', 'Heineken', 2800, 4500),
        ('Amstel Lager 330ml', 'Heineken', 2500, 4000),
        ('Windhoek Lager 330ml', 'Namibia Breweries', 2700, 4300),
        ('Windhoek Draught 440ml', 'Namibia Breweries', 2900, 4500),
        ('Carlsberg Export 330ml', 'Carlsberg', 2600, 4200),
        ('Tuborg Green 330ml', 'Carlsberg', 2500, 4000),
        ('Guinness Foreign Extra Stout 330ml', 'Diageo', 3000, 5000),
        ('Guinness Smooth 330ml', 'Diageo', 2800, 4500),
        ('Redds Premium Cold 330ml', 'AB InBev', 2400, 3800),
        ('Brutal Fruit Litchi 275ml', 'AB InBev', 2500, 4000),
        ('Flying Fish Lemon 330ml', 'AB InBev', 2500, 4000),
        ('Hunter Gold 275ml', 'Distell', 2600, 4200),
        ('Hunter Dry 275ml', 'Distell', 2600, 4200),
        ('Savanna Dry 330ml', 'Distell', 2800, 4500),
        ('Savanna Light 330ml', 'Distell', 2700, 4300),
        ('Hunters Extreme 275ml', 'Distell', 2700, 4300),
        ('Bavaria Non-Alcoholic 330ml', 'Bavaria', 2000, 3200),
        ('Clausthaler Non-Alcoholic 330ml', 'Clausthaler', 2200, 3500),
        ('Corona Extra 355ml', 'AB InBev', 3200, 5000),
        ('Stella Artois 330ml', 'AB InBev', 3000, 4800),
        ('Budweiser 330ml', 'AB InBev', 2800, 4500),
        ('Beck\'s 330ml', 'AB InBev', 2700, 4300),
        ('Pilsner Urquell 330ml', 'Asahi', 3200, 5000),
        ('Peroni Nastro Azzurro 330ml', 'Asahi', 3100, 4800),
        ('Desperados 330ml', 'Heineken', 3000, 4800),
        ('Sol Mexican Beer 330ml', 'Heineken', 2900, 4500),
        ('Tiger Beer 330ml', 'Heineken', 2700, 4300),
        ('Bia Saigon Lager 330ml', 'Sabeco', 2400, 3800),
        ('Balimi Lager 500ml', 'Local Craft', 2500, 4000),
        ('Kibo Gold 500ml', 'Local Craft', 2600, 4200),
        ('Manyara Pale Ale 330ml', 'Craft TZ', 3500, 5500),
        ('Ngoro IPA 330ml', 'Craft TZ', 3800, 6000),
        ('Zanzibar Wheat Beer 330ml', 'Craft TZ', 3600, 5500),
        ('Coastal Lager 500ml', 'Coastal Brew', 2100, 3300),
        ('Dar Special 500ml', 'Coastal Brew', 2000, 3200),
        ('Twiga Beer 500ml', 'Twiga Brewery', 2200, 3500),
        ('Uhuru Lager 500ml', 'Uhuru Brew', 2100, 3300),
        ('Simba Stout 500ml', 'Simba Brew', 2400, 3800),
        ('Tembo Dark 500ml', 'Tembo Brew', 2500, 4000),
        ('Maji Malt Drink 330ml', 'Maji Malt', 1800, 2800),
        ('Malta Guinness 330ml', 'Diageo', 2000, 3200),
        ('Grand Malt 330ml', 'Grand', 1800, 2800),
    ]
    for name, brand, buy, sell in beers:
        items.append(row(name, f'BEER-{n:03d}', 'Vinywaji', 'Bia', brand, buy, sell, unit='bottle', stock=48))
        n += 1

    # --- Wines ---
    wines = [
        ('Drostdy-Hof Claret Pinotage 750ml', 'Drostdy-Hof', 'Red Wine', 12000, 18000),
        ('Drostdy-Hof Chardonnay 750ml', 'Drostdy-Hof', 'White Wine', 12000, 18000),
        ('Nederburg Cabernet Sauvignon 750ml', 'Nederburg', 'Red Wine', 18000, 28000),
        ('Nederburg Sauvignon Blanc 750ml', 'Nederburg', 'White Wine', 17000, 26000),
        ('Four Cousins Red 750ml', 'Four Cousins', 'Red Wine', 14000, 22000),
        ('Four Cousins White 750ml', 'Four Cousins', 'White Wine', 14000, 22000),
        ('Four Cousins Rose 750ml', 'Four Cousins', 'Rose Wine', 14000, 22000),
        ('JC Le Roux Le Domaine 750ml', 'JC Le Roux', 'Sparkling', 16000, 25000),
        ('JC Le Roux La Fleurette 750ml', 'JC Le Roux', 'Sparkling', 16000, 25000),
        ('Cellar Cask Red 5L', 'Cellar Cask', 'Red Wine', 28000, 42000),
        ('Cellar Cask White 5L', 'Cellar Cask', 'White Wine', 28000, 42000),
        ('Namaqua Red 750ml', 'Namaqua', 'Red Wine', 11000, 17000),
        ('Namaqua White 750ml', 'Namaqua', 'White Wine', 11000, 17000),
        ('Robertson Winery Pinotage 750ml', 'Robertson', 'Red Wine', 15000, 23000),
        ('Robertson Winery Chardonnay 750ml', 'Robertson', 'White Wine', 15000, 23000),
        ('KWV Classic Cabernet 750ml', 'KWV', 'Red Wine', 16000, 25000),
        ('KWV Classic Chenin Blanc 750ml', 'KWV', 'White Wine', 15000, 23000),
        ('Obikwa Merlot 750ml', 'Obikwa', 'Red Wine', 13000, 20000),
        ('Obikwa Sauvignon Blanc 750ml', 'Obikwa', 'White Wine', 13000, 20000),
        ('Two Oceans Shiraz 750ml', 'Two Oceans', 'Red Wine', 14000, 22000),
        ('Two Oceans Sauvignon Blanc 750ml', 'Two Oceans', 'White Wine', 14000, 22000),
        ('Barefoot Moscato 750ml', 'Barefoot', 'White Wine', 18000, 28000),
        ('Barefoot Pink Moscato 750ml', 'Barefoot', 'Rose Wine', 18000, 28000),
        ('Yellow Tail Shiraz 750ml', 'Yellow Tail', 'Red Wine', 19000, 30000),
        ('Yellow Tail Chardonnay 750ml', 'Yellow Tail', 'White Wine', 19000, 30000),
        ('Jacobs Creek Classic Shiraz 750ml', 'Jacobs Creek', 'Red Wine', 20000, 32000),
        ('Jacobs Creek Classic Chardonnay 750ml', 'Jacobs Creek', 'White Wine', 20000, 32000),
        ('Gato Negro Cabernet 750ml', 'Gato Negro', 'Red Wine', 15000, 24000),
        ('Gato Negro Sauvignon Blanc 750ml', 'Gato Negro', 'White Wine', 15000, 24000),
        ('Freixenet Cordon Negro Brut 750ml', 'Freixenet', 'Sparkling', 25000, 40000),
        ('Martini Asti 750ml', 'Martini', 'Sparkling', 22000, 35000),
        ('Moet & Chandon Imp Brut 750ml', 'Moet', 'Champagne', 95000, 140000),
        ('Veuve Clicquot Yellow Label 750ml', 'Veuve Clicquot', 'Champagne', 110000, 160000),
        ('Prosecco Villa Sandi 750ml', 'Villa Sandi', 'Sparkling', 28000, 45000),
        ('Chamdor Non-Alcoholic Red 750ml', 'Chamdor', 'Non-Alc Wine', 9000, 14000),
        ('Chamdor Non-Alcoholic White 750ml', 'Chamdor', 'Non-Alc Wine', 9000, 14000),
        ('J.P. Chenet Cabernet Syrah 750ml', 'JP Chenet', 'Red Wine', 16000, 25000),
        ('J.P. Chenet Colombard Chardonnay 750ml', 'JP Chenet', 'White Wine', 16000, 25000),
        ('Sangria Casillero 750ml', 'Concha y Toro', 'Sangria', 15000, 23000),
        ('Port Wine Ruby 750ml', 'Generic Port', 'Fortified', 18000, 28000),
    ]
    for name, brand, cat, buy, sell in wines:
        items.append(row(name, f'WINE-{n:03d}', 'Vinywaji', cat, brand, buy, sell, stock=12))
        n += 1

    # --- Whisky / whiskey ---
    whiskies = [
        ('Johnnie Walker Red Label 750ml', 'Johnnie Walker', 45000, 70000),
        ('Johnnie Walker Black Label 750ml', 'Johnnie Walker', 75000, 110000),
        ('Johnnie Walker Double Black 750ml', 'Johnnie Walker', 95000, 140000),
        ('Johnnie Walker Gold Label 750ml', 'Johnnie Walker', 130000, 190000),
        ('Johnnie Walker Blue Label 750ml', 'Johnnie Walker', 380000, 550000),
        ('Jack Daniel\'s Old No.7 750ml', 'Jack Daniel\'s', 55000, 85000),
        ('Jack Daniel\'s Honey 750ml', 'Jack Daniel\'s', 58000, 90000),
        ('Jack Daniel\'s Apple 750ml', 'Jack Daniel\'s', 58000, 90000),
        ('Jameson Irish Whiskey 750ml', 'Jameson', 52000, 80000),
        ('Jameson Black Barrel 750ml', 'Jameson', 70000, 105000),
        ('Chivas Regal 12 Years 750ml', 'Chivas', 80000, 120000),
        ('Chivas Regal 18 Years 750ml', 'Chivas', 160000, 240000),
        ('Ballantine\'s Finest 750ml', 'Ballantine\'s', 40000, 62000),
        ('Teachers Highland Cream 750ml', 'Teachers', 38000, 58000),
        ('Grants Triple Wood 750ml', 'Grants', 36000, 55000),
        ('Famous Grouse 750ml', 'Famous Grouse', 42000, 65000),
        ('J&B Rare 750ml', 'J&B', 40000, 62000),
        ('William Lawson\'s 750ml', 'William Lawson\'s', 35000, 55000),
        ('Vat 69 750ml', 'Vat 69', 32000, 50000),
        ('Black & White Whisky 750ml', 'Black & White', 30000, 48000),
        ('Something Special 750ml', 'Something Special', 34000, 52000),
        ('Passport Scotch 750ml', 'Passport', 28000, 45000),
        ('Clan Campbell 750ml', 'Clan Campbell', 30000, 48000),
        ('Glenfiddich 12 Years 750ml', 'Glenfiddich', 110000, 165000),
        ('Glenlivet 12 Years 750ml', 'Glenlivet', 115000, 170000),
        ('Macallan 12 Double Cask 750ml', 'Macallan', 220000, 320000),
        ('Monkey Shoulder 700ml', 'Monkey Shoulder', 90000, 135000),
        ('Bushmills Original 750ml', 'Bushmills', 48000, 75000),
        ('Tullamore Dew 750ml', 'Tullamore Dew', 50000, 78000),
        ('Canadian Club 750ml', 'Canadian Club', 45000, 70000),
        ('Jim Beam White 750ml', 'Jim Beam', 48000, 75000),
        ('Jim Beam Honey 750ml', 'Jim Beam', 50000, 78000),
        ('Maker\'s Mark 750ml', 'Maker\'s Mark', 85000, 130000),
        ('Woodford Reserve 750ml', 'Woodford Reserve', 95000, 145000),
        ('Bulleit Bourbon 750ml', 'Bulleit', 80000, 120000),
        ('Southern Comfort 750ml', 'Southern Comfort', 42000, 65000),
        ('Fireball Cinnamon Whisky 750ml', 'Fireball', 45000, 70000),
        ('Honey Jack Mini 50ml', 'Jack Daniel\'s', 3500, 6000),
        ('JW Red Mini 50ml', 'Johnnie Walker', 3000, 5000),
        ('JW Black Mini 50ml', 'Johnnie Walker', 5000, 8000),
    ]
    for name, brand, buy, sell in whiskies:
        items.append(row(name, f'WSK-{n:03d}', 'Vinywaji', 'Whisky', brand, buy, sell, stock=8))
        n += 1

    # --- Vodka, Gin, Rum, Brandy, Tequila ---
    spirits = [
        ('Smirnoff Red Vodka 750ml', 'Vodka', 'Smirnoff', 35000, 55000),
        ('Smirnoff Ice 275ml', 'Ready to Drink', 'Smirnoff', 2500, 4000),
        ('Absolut Vodka 750ml', 'Vodka', 'Absolut', 45000, 70000),
        ('Absolut Citron 750ml', 'Vodka', 'Absolut', 48000, 75000),
        ('Grey Goose Vodka 750ml', 'Vodka', 'Grey Goose', 120000, 180000),
        ('Ciroc Vodka 750ml', 'Vodka', 'Ciroc', 110000, 165000),
        ('Belvedere Vodka 700ml', 'Vodka', 'Belvedere', 115000, 170000),
        ('Russia Standard Vodka 750ml', 'Vodka', 'Russian Standard', 38000, 58000),
        ('Skyy Vodka 750ml', 'Vodka', 'Skyy', 40000, 62000),
        ('Gordons London Dry Gin 750ml', 'Gin', 'Gordons', 32000, 50000),
        ('Gordons Pink Gin 750ml', 'Gin', 'Gordons', 35000, 55000),
        ('Tanqueray London Dry 750ml', 'Gin', 'Tanqueray', 55000, 85000),
        ('Tanqueray Sevilla 700ml', 'Gin', 'Tanqueray', 60000, 90000),
        ('Bombay Sapphire 750ml', 'Gin', 'Bombay', 65000, 100000),
        ('Beefeater London Dry 750ml', 'Gin', 'Beefeater', 48000, 75000),
        ('Hendricks Gin 700ml', 'Gin', 'Hendricks', 95000, 145000),
        ('Captain Morgan Spiced Rum 750ml', 'Rum', 'Captain Morgan', 38000, 58000),
        ('Captain Morgan Dark Rum 750ml', 'Rum', 'Captain Morgan', 40000, 62000),
        ('Bacardi Carta Blanca 750ml', 'Rum', 'Bacardi', 40000, 62000),
        ('Bacardi Gold 750ml', 'Rum', 'Bacardi', 42000, 65000),
        ('Malibu Coconut Rum 750ml', 'Rum', 'Malibu', 38000, 58000),
        ('Havana Club 3 Anos 750ml', 'Rum', 'Havana Club', 45000, 70000),
        ('Appleton Estate Signature 750ml', 'Rum', 'Appleton', 50000, 78000),
        ('Bundaberg Rum 700ml', 'Rum', 'Bundaberg', 42000, 65000),
        ('Konyagi Gin 750ml', 'Gin', 'Konyagi', 12000, 18000),
        ('Konyagi Gin 250ml', 'Gin', 'Konyagi', 4500, 7000),
        ('Bond 7 Whisky 750ml', 'Whisky', 'Bond 7', 18000, 28000),
        ('Chrome Vodka 750ml', 'Vodka', 'Chrome', 15000, 24000),
        ('Viceroy Brandy 750ml', 'Brandy', 'Viceroy', 22000, 35000),
        ('Klipdrift Premium Brandy 750ml', 'Brandy', 'Klipdrift', 28000, 45000),
        ('Klipdrift Export 750ml', 'Brandy', 'Klipdrift', 25000, 40000),
        ('Oude Meester Brandy 750ml', 'Brandy', 'Oude Meester', 30000, 48000),
        ('Richelieu Brandy 750ml', 'Brandy', 'Richelieu', 26000, 42000),
        ('KWV 5 Year Brandy 750ml', 'Brandy', 'KWV', 32000, 50000),
        ('Remy Martin VSOP 700ml', 'Cognac', 'Remy Martin', 140000, 210000),
        ('Hennessy VS 700ml', 'Cognac', 'Hennessy', 130000, 195000),
        ('Hennessy VSOP 700ml', 'Cognac', 'Hennessy', 220000, 320000),
        ('Martell VS 700ml', 'Cognac', 'Martell', 125000, 185000),
        ('Courvoisier VS 700ml', 'Cognac', 'Courvoisier', 120000, 180000),
        ('Jose Cuervo Especial Gold 750ml', 'Tequila', 'Jose Cuervo', 45000, 70000),
        ('Jose Cuervo Silver 750ml', 'Tequila', 'Jose Cuervo', 45000, 70000),
        ('Olmeca Gold 750ml', 'Tequila', 'Olmeca', 42000, 65000),
        ('Olmeca Blanco 750ml', 'Tequila', 'Olmeca', 42000, 65000),
        ('Patrón Silver 750ml', 'Tequila', 'Patron', 150000, 220000),
        ('Campari Bitter 750ml', 'Liqueur', 'Campari', 48000, 75000),
        ('Aperol 750ml', 'Liqueur', 'Aperol', 45000, 70000),
        ('Baileys Irish Cream 750ml', 'Liqueur', 'Baileys', 50000, 78000),
        ('Amarula Cream 750ml', 'Liqueur', 'Amarula', 40000, 62000),
        ('Jagermeister 700ml', 'Liqueur', 'Jagermeister', 55000, 85000),
        ('Cointreau 700ml', 'Liqueur', 'Cointreau', 70000, 105000),
        ('Martini Rosso 750ml', 'Vermouth', 'Martini', 28000, 45000),
        ('Martini Bianco 750ml', 'Vermouth', 'Martini', 28000, 45000),
        ('Martini Extra Dry 750ml', 'Vermouth', 'Martini', 28000, 45000),
    ]
    for name, cat, brand, buy, sell in spirits:
        items.append(row(name, f'SPR-{n:03d}', 'Vinywaji', cat, brand, buy, sell, stock=10))
        n += 1

    # --- Soft drinks / mixers / energy / water ---
    softs = [
        ('Coca-Cola 500ml', 'Soft Drinks', 'Coca-Cola', 800, 1500, 60),
        ('Coca-Cola 1.5L', 'Soft Drinks', 'Coca-Cola', 1800, 3000, 24),
        ('Coca-Cola 300ml Glass', 'Soft Drinks', 'Coca-Cola', 700, 1200, 48),
        ('Fanta Orange 500ml', 'Soft Drinks', 'Fanta', 800, 1500, 48),
        ('Fanta Pineapple 500ml', 'Soft Drinks', 'Fanta', 800, 1500, 36),
        ('Sprite 500ml', 'Soft Drinks', 'Sprite', 800, 1500, 48),
        ('Sprite 1.5L', 'Soft Drinks', 'Sprite', 1800, 3000, 24),
        ('Stoney Tangawizi 500ml', 'Soft Drinks', 'Stoney', 900, 1600, 36),
        ('Schweppes Tonic Water 500ml', 'Mixers', 'Schweppes', 1000, 1800, 36),
        ('Schweppes Soda Water 500ml', 'Mixers', 'Schweppes', 900, 1600, 36),
        ('Schweppes Ginger Ale 500ml', 'Mixers', 'Schweppes', 1000, 1800, 24),
        ('Red Bull Energy 250ml', 'Energy Drinks', 'Red Bull', 2500, 4000, 48),
        ('Red Bull Sugarfree 250ml', 'Energy Drinks', 'Red Bull', 2500, 4000, 24),
        ('Monster Energy Green 500ml', 'Energy Drinks', 'Monster', 2800, 4500, 36),
        ('Monster Ultra White 500ml', 'Energy Drinks', 'Monster', 2800, 4500, 24),
        ('Predator Energy 400ml', 'Energy Drinks', 'Predator', 1500, 2500, 36),
        ('Power Play Energy 400ml', 'Energy Drinks', 'Power Play', 1400, 2300, 36),
        ('Azam Cola 500ml', 'Soft Drinks', 'Azam', 700, 1200, 48),
        ('Azam Apple 500ml', 'Soft Drinks', 'Azam', 700, 1200, 36),
        ('Pepsi 500ml', 'Soft Drinks', 'Pepsi', 800, 1500, 36),
        ('Mirinda Orange 500ml', 'Soft Drinks', 'Mirinda', 800, 1500, 36),
        ('7UP 500ml', 'Soft Drinks', '7UP', 800, 1500, 36),
        ('Minute Maid Apple 400ml', 'Juice', 'Minute Maid', 1200, 2000, 36),
        ('Minute Maid Orange 400ml', 'Juice', 'Minute Maid', 1200, 2000, 36),
        ('Afya Juice Mango 500ml', 'Juice', 'Afya', 1000, 1800, 36),
        ('Azam Juice Tropical 500ml', 'Juice', 'Azam', 900, 1600, 36),
        ('Kilimanjaro Drinking Water 500ml', 'Water', 'Kilimanjaro', 500, 1000, 96),
        ('Kilimanjaro Drinking Water 1.5L', 'Water', 'Kilimanjaro', 900, 1500, 48),
        ('Uhai Water 500ml', 'Water', 'Uhai', 400, 800, 96),
        ('Dasani Water 500ml', 'Water', 'Dasani', 600, 1000, 72),
        ('Sparkling Water 500ml', 'Water', 'Generic', 800, 1500, 36),
        ('Soda Water Mixer 300ml', 'Mixers', 'Generic', 700, 1200, 48),
        ('Tonic Water Mixer 300ml', 'Mixers', 'Generic', 800, 1400, 48),
        ('Ginger Beer 330ml', 'Soft Drinks', 'Generic', 1000, 1800, 36),
        ('Bitter Lemon 330ml', 'Mixers', 'Schweppes', 1000, 1800, 24),
        ('Ice Cubes Bag 2kg', 'Bar Supplies', 'House', 2000, 4000, 20),
        ('Lemon Fresh Pack', 'Bar Supplies', 'House', 1500, 3000, 30),
        ('Cocktail Cherries Jar', 'Bar Supplies', 'House', 8000, 12000, 10),
        ('Salt Rimmer Pack', 'Bar Supplies', 'House', 3000, 5000, 15),
        ('Straws Pack 100pcs', 'Bar Supplies', 'House', 2500, 4000, 20),
    ]
    for name, cat, brand, buy, sell, stock in softs:
        items.append(row(name, f'SFT-{n:03d}', 'Vinywaji', cat, brand, buy, sell, stock=stock))
        n += 1

    # Pad / trim to exactly 200
    if len(items) < 200:
        extras = [
            ('Safari Lager Can 330ml', 'Bia', 'Tanzania Breweries', 2000, 3200),
            ('Kilimanjaro Can 330ml', 'Bia', 'Tanzania Breweries', 2100, 3300),
            ('Serengeti Can 330ml', 'Bia', 'Serengeti Breweries', 2000, 3200),
            ('Heineken Can 330ml', 'Bia', 'Heineken', 2700, 4300),
            ('Castle Lite Can 330ml', 'Bia', 'AB InBev', 2200, 3600),
            ('Smirnoff Ice Double Black 275ml', 'Ready to Drink', 'Smirnoff', 2800, 4500),
            ('Brutal Fruit Ruby Apple 275ml', 'Ready to Drink', 'AB InBev', 2500, 4000),
            ('Flying Fish Passion 330ml', 'Ready to Drink', 'AB InBev', 2500, 4000),
            ('Bernini Blush 275ml', 'Ready to Drink', 'Distell', 2700, 4300),
            ('Bernini Classic 275ml', 'Ready to Drink', 'Distell', 2700, 4300),
            ('Hunters Edge 275ml', 'Ready to Drink', 'Distell', 2600, 4200),
            ('Red Square Vodka Energy 275ml', 'Ready to Drink', 'Red Square', 2400, 3800),
            ('Belvedere Intense 700ml', 'Vodka', 'Belvedere', 125000, 185000),
            ('Absolut Vanilla 750ml', 'Vodka', 'Absolut', 48000, 75000),
            ('Captain Morgan White Rum 750ml', 'Rum', 'Captain Morgan', 38000, 58000),
            ('Bacardi Oakheart 750ml', 'Rum', 'Bacardi', 45000, 70000),
            ('JW Red Label 1L', 'Whisky', 'Johnnie Walker', 55000, 85000),
            ('JW Black Label 1L', 'Whisky', 'Johnnie Walker', 95000, 140000),
            ('Jameson 1L', 'Whisky', 'Jameson', 65000, 100000),
            ('Amarula Mini 50ml', 'Liqueur', 'Amarula', 3000, 5000),
        ]
        for name, cat, brand, buy, sell in extras:
            if len(items) >= 200:
                break
            items.append(row(name, f'EXT-{n:03d}', 'Vinywaji', cat, brand, buy, sell, stock=20))
            n += 1

    return items[:200]


def main():
    items = build_items()
    assert len(items) == 200, len(items)

    wb = Workbook()
    ws = wb.active
    ws.title = 'Bidhaa'
    ws.append([HEADERS[f] for f in FIELDS])
    ws.append(list(FIELDS))
    for cell in ws[1]:
        cell.font = Font(bold=True)

    for it in items:
        ws.append([it.get(f, '') for f in FIELDS])

    out = Path(__file__).resolve().parent / 'sample_pub_drinks_200.xlsx'
    wb.save(out)
    print(f'Wrote {len(items)} items -> {out}')


if __name__ == '__main__':
    main()
