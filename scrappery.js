const puppeteer = require('puppeteer');
const fs = require('fs');
const { parse } = require('json2csv');

// List of product search keywords
const productKeywords = [
  // Soap and Body Hygiene
  "Patanjali Aloe Vera Soap",
  "Yardley English Lavender Soap",
  "Khadi Rose Water Soap",
  "Patanjali Neem Tulsi Soap",
  "Forest Essentials Ayurvedic Soap",
  "Santoor Gold Soap",
  "Godrej Protekt Soap",
  "Bombay Shaving Company Charcoal Soap",
  "Mamaearth Ubtan Soap",
  "Himalaya Aloe Vera Soap",
  "VLCC Ayurveda Soap",
  "The Man Company Soap",
  "Beardo Activated Charcoal Soap",
  "Organic Harvest Soap",
  "Vaadi Herbals Soap",
  "Joy Aloe Vera Soap",
  "Biotique Basil & Parsley Soap",
  "Lever Ayush Purifying Soap",
  "Santoor Sandalwood Soap",
  "Cinthol Cool Soap",
  
  // Body Wash and Hygiene
  "Palmolive Thermal Spa Body Wash",
  "Biotique Almond Oil Body Wash",
  "Pears Shower Gel",
  "Nivea Men Active Clean Shower Gel",
  "Mamaearth Tea Tree Body Wash",
  "Himalaya Moisturizing Aloe Vera Face Wash",
  "Khadi Sandalwood Face Wash",
  "Clean & Clear Foaming Face Wash",
  "Himalaya Neem Face Wash",
  "Lotus Herbals Safe Sun Face Wash",
  "VLCC Anti-Tan Face Wash",
  "Olay Total Effects Face Wash",
  "Garnier Light Complete Face Wash",
  "L'Oréal Paris Go 360 Clean Face Wash",
  "Patanjali Rose Face Wash",
  "The Body Shop Tea Tree Face Wash",
  "Himalaya Anti-Hair Fall Shampoo",
  "TRESemmé Keratin Smooth Shampoo",
  "Clinic Plus Strong & Long Shampoo",
  "L'Oréal Total Repair 5 Shampoo",
  "Pantene Pro-V Hair Fall Control Shampoo",
  
  // Hair Care
  "Dove Intense Repair Shampoo",
  "Head & Shoulders Anti-Dandruff Shampoo",
  "Garnier Fructis Triple Nutrition Shampoo",
  "Biotique Bio Kelp Shampoo",
  "Khadi Natural Herbal Shampoo",
  "Herbal Essences Argan Oil Shampoo",
  "VLCC Hair Fall Control Shampoo",
  "Wow Apple Cider Vinegar Shampoo",
  "Mamaearth Onion Shampoo",
  "TRESemmé Botanique Detox Shampoo",
  "Indulekha Bringha Shampoo",
  "Parachute Advanced Coconut Oil",
  "Bajaj Almond Drops Hair Oil",
  "Livon Hair Serum",
  "Pantene Oil Replacement",
  "Dove Elixir Hair Oil",
  "Himalaya Anti-Dandruff Hair Oil",
  "Clinic Plus Non-Sticky Hair Oil",
  "Parachute Aloe Vera Enriched Hair Oil",
  "Himalaya Protein Hair Cream",
  
  // Deodorants & Perfumes
  "Denver Deo",
  "Nivea Men Fresh Active Deodorant",
  "Park Avenue Signature Collection Deo",
  "Engage Women’s Deo",
  "Fogg Scent Xpressio Perfume",
  "Axe Dark Temptation Deodorant",
  "Set Wet Cool Hold Gel",
  "Wild Stone Code Titanium Perfume",
  "Nike Urban Musk Deo",
  "Nautica Voyage Eau de Toilette",
  "Titan Skinn Raw Perfume",
  "Yardley English Rose Perfume",
  "Jovan Musk Cologne",
  "Burberry London Eau de Parfum",
  "Versace Pour Homme Eau de Toilette",
  "Gucci Guilty Black Eau de Toilette",
  "Calvin Klein One Perfume",
  "Issey Miyake L'eau D'issey Perfume",
  "Carolina Herrera 212 Men",
  "Montblanc Legend Perfume",
  
  // Packaged Food
  "Nestle KitKat",
  "Cadbury Dairy Milk",
  "Amul Dark Chocolate",
  "Britannia NutriChoice Digestive Biscuits",
  "Parle Monaco Biscuits",
  "Sunfeast Marie Light Biscuits",
  "Kellogg's Chocos",
  "Nestlé Cerelac",
  "Saffola Masala Oats",
  "MTR Poha",
  "ACT II Microwave Popcorn",
  "Haldiram's Aloo Bhujia",
  "Kurkure Masala Munch",
  "Lay's American Style Cream & Onion",
  "Bingo Mad Angles",
  "Too Yumm Multigrain Chips",
  "Pringles Sour Cream & Onion",
  "Britannia Rusk",
  "Sunfeast Farmlite Digestive Biscuits",
  "McVitie's Digestive Biscuits",
  
  // Beverages
  "Tata Tea Gold",
  "Red Label Tea",
  "Bru Instant Coffee",
  "Nescafe Classic Coffee",
  "Complan Nutrition Drink",
  "Horlicks Classic Malt",
  "Bournvita Chocolate Health Drink",
  "Boost Health Drink",
  "Nestlé Everyday Dairy Whitener",
  "Amul Kool Milk",
  "Mother Dairy Chaach",
  "Tropicana Orange Juice",
  "Real Fruit Power Mixed Fruit",
  "Paper Boat Aam Panna",
  "Sprite Soft Drink",
  "Coca-Cola",
  "Pepsi",
  "Mirinda",
  "Frooti",
  "Appy Fizz",
  
  // Personal Care
  "Colgate Total Toothpaste",
  "Pepsodent Germicheck Toothpaste",
  "Close-Up Ever Fresh Gel Toothpaste",
  "Sensodyne Sensitive Toothpaste",
  "Himalaya Herbal Toothpaste",
  "Patanjali Dant Kanti",
  "Oral-B Pro-Health Toothbrush",
  "Colgate ZigZag Toothbrush",
  "Dabur Red Toothpaste",
  "Listerine Cool Mint Mouthwash",
  "Dabur Meswak Toothpaste",
  "Nivea Soft Cream",
  "Ponds Moisturizing Cold Cream",
  "Garnier Skin Naturals Moisturizer",
  "Lakme Peach Milk Moisturizer",
  "VLCC Sunscreen Lotion",
  "Lotus Herbals Sunscreen",
  "Himalaya Nourishing Body Lotion",
  "Vaseline Intensive Care Deep Restore Lotion",
  "Dove Beauty Cream",
  
  // Home Essentials
  "Vim Dishwash Gel",
  "Harpic Power Plus Toilet Cleaner",
  "Lizol Floor Cleaner",
  "Colin Glass Cleaner",
  "Surf Excel Matic Detergent Powder",
  "Tide Plus Detergent Powder",
  "Ariel Complete Detergent Powder",
  "Comfort Fabric Conditioner",
  "Rin Detergent Bar",
  "Wheel Detergent Powder",
  "Dettol Antiseptic Liquid",
  "Savlon Surface Disinfectant Spray",
  "Patanjali Dishwash Bar",
  "Godrej Ezee Liquid Detergent",
  "Harpic Flushmatic In-Cistern Block",
  "Domex Disinfectant Toilet Cleaner",
  "Pril Dishwash Liquid",
  "Exo Dishwash Bar",
  "Good Knight Power Activ+ Liquid Vaporizer",
  "All Out Ultra Mosquito Repellant",
  
  // Baby Care
  "Johnson’s Baby Powder",
  "Pampers Premium Care Diapers",
  "Huggies Wonder Pants",
  "MamyPoko Pants Diapers",
  "Sebamed Baby Lotion",
  "Mamaearth Baby Body Lotion",
  "Himalaya Baby Lotion",
  "Mee Mee Baby Shampoo",
  "Chicco Baby Bath",
  "Dabur Lal Tail",
  "Cetaphil Baby Moisturizing Lotion",
  "Pigeon Baby Wipes",
  "Johnson’s Baby Soap",
  "Pampers Baby Dry Pants",
  "Huggies Diapers Wonder Pants",
  "Himalaya Baby Powder",
  "Dove Baby Moisture Lotion",
  "Mother Sparsh Water Wipes",
  "Nestlé NAN PRO 1 Infant Formula",
  "Similac Advance Baby Formula",
  
  // Health & Nutrition
  "Ensure Diabetes Care",
  "Horlicks Women's Plus",
  "Bournvita Little Champs",
  "Protinex Original",
  "Patanjali Chyawanprash",
  "Dabur Honey",
  "Himalaya Liv.52",
  "Zandu Kesari Jivan",
  "Baidyanath Chyawanprash",
  "Organic India Tulsi Green Tea",
  "Himalaya Ashwagandha Tablets",
  "Dabur Giloy Ghanvati",
  "Kapiva Organic Apple Cider Vinegar",
  "MuscleBlaze Whey Protein",
  "Optimum Nutrition Gold Standard Whey",
  "Herbalife Nutrition Shake",
  "Garden of Life Organic Protein",
  "Amway Nutrilite Daily Tablets",
  "Patanjali Giloy Juice",
  "Dabur Shilajit Gold Capsules",
  
  // Snacks & Ready-to-Eat
  "MTR Ready-to-Eat Dal Makhani",
  "Haldiram's Rasgulla",
  "Bikano Soan Papdi",
  "Britannia Cake",
  "Patanjali Biscuits",
  "Sunfeast Bounce Biscuits",
  "Britannia Little Hearts",
  "Balaji Wafers",
  "ITC Sunfeast Pasta Treat",
  "Unibic Cookies",
  "Cadbury Perk",
  "Amul Ice Cream",
  "Mother Dairy Ice Cream",
  "Kwality Wall's Ice Cream",
  "Haldiram's Samosa",
  "Haldiram's Kaju Katli",
  "Kissan Mixed Fruit Jam",
  "Dr. Oetker Funfoods Mayonnaise",
  "Del Monte Tomato Ketchup",
  "Veeba Chipotle Southwest Sauce"
];

async function scrapeProducts() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const allProducts = []; // Array to store all products from multiple searches

    for (const keyword of productKeywords) {
        // Generate the search URL by encoding the keyword
        const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(keyword)}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off`;

        let hasNextPage = true;
        let pageNumber = 1;

        while (hasNextPage) {
            // Go to the current page
            await page.goto(`${searchUrl}&page=${pageNumber}`, { waitUntil: 'networkidle2' });

            // Close any potential popups or modals
            const closePopupButton = await page.$('button._2KpZ6l');
            if (closePopupButton) {
                await closePopupButton.click();
            }

            // Wait for product cards to load
            await page.waitForSelector('div._75nlfW');

            // Extract product details from the cards
            const products = await page.evaluate(() => {
                const productData = [];
                const productCards = document.querySelectorAll('div._75nlfW');

                productCards.forEach(card => {
                    const title = card.querySelector('a.wjcEIp')?.innerText || ''; // Product title
                    const price = card.querySelector('div.Nx9bqj')?.innerText || ''; // Current price
                    const originalPrice = card.querySelector('div.yRaY8j')?.innerText || ''; // Original price
                    const weight = card.querySelector('div.NqpwHC')?.innerText || ''; // Weight
                    const imgTag = card.querySelector('img.DByuf4'); // Select the image tag
                    const imageUrl = imgTag ? imgTag.src : ''; // Extract image URL
                    const productLink = card.querySelector('a.VJA3rP')?.href || ''; // Product link

                    // Extract the product ID from the link
                    const productIdMatch = productLink.match(/pid=([a-zA-Z0-9]+)/);
                    const productId = productIdMatch ? productIdMatch[1] : '';

                    productData.push({
                        productId,
                        title,
                        weight,
                        price,
                        originalPrice,
                        imageUrl
                    });
                });
                return productData; // Return the array of products
            });

            // Add the extracted products to the allProducts array
            allProducts.push(...products);

            // Check if there is a next page button and navigate to the next page
            const nextPageButton = await page.$('a._1LKTO3');
            hasNextPage = nextPageButton !== null;

            if (hasNextPage) {
                pageNumber++; // Increment page number
            }
        }
    }

    // Convert all product data to CSV format
    if (allProducts.length > 0) {
        const csv = parse(allProducts, { fields: ['productId', 'title', 'weight', 'price', 'originalPrice', 'imageUrl'] });
        fs.writeFileSync('products.csv', csv, 'utf-8'); // Save to CSV file
        console.log('Data saved to products.csv');
    } else {
        console.log('No products found.');
    }

    await browser.close();
}

scrapeProducts();
