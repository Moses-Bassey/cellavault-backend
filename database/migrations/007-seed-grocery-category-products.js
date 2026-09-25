'use strict';

const groceryData = {
  "Fruits": ["Apple", "Avocado", "Banana", "Blackberry", "Blueberry", "Cherry", "Coconut", "Cranberry", "Date", "Fig", "Grape", "Grapefruit", "Guava", "Kiwi", "Lemon", "Lime", "Mango", "Melon", "Nectarine", "Orange", "Papaya", "Passion fruit", "Peach", "Pear", "Pineapple", "Plum", "Pomegranate", "Raspberry", "Strawberry", "Tangerine", "Watermelon"],
  "Vegetables": ["Artichoke", "Asparagus", "Beetroot", "Bell pepper", "Bok choy", "Broccoli", "Brussels sprouts", "Cabbage", "Carrot", "Cauliflower", "Celery", "Corn", "Cucumber", "Eggplant", "Garlic", "Green beans", "Green onions", "Kale", "Leeks", "Lettuce", "Mushrooms", "Okra", "Onions", "Peas", "Potatoes", "Radish", "Spinach", "Squash", "Sweet potatoes", "Tomatoes"],
  "Dairy": ["Butter", "Buttermilk", "Cheddar cheese", "Cottage cheese", "Cream", "Cream cheese", "Feta cheese", "Ice cream", "Margarine", "Milk", "Mozzarella", "Parmesan", "Sour cream", "Whipped cream", "Yogurt"],
  "Bread": ["Baguette", "Bagels", "Brioche", "French bread", "Garlic bread", "Hamburger buns", "Hot dog buns", "Multigrain bread", "Pita bread", "Rye bread", "Sourdough bread", "White bread", "Whole-grain bread", "Whole-wheat bread", "Wraps"],
  "Baked Goods": ["Brownies", "Cake", "Cheesecake", "Cookies", "Cupcakes", "Croissants", "Donuts", "Danish pastries", "Eclairs", "Muffins", "Pancakes", "Pies", "Tarts", "Waffles"],
  "Meat": ["Bacon", "Beef", "Chicken", "Chicken wings", "Deli meat", "Goat meat", "Ground beef", "Ham", "Lamb", "Mutton", "Pork", "Sausage", "Steak", "Turkey", "Veal"],
  "Fish & Seafood": ["Anchovies", "Catfish", "Cod", "Crab", "Hake", "Herring", "Lobster", "Mackerel", "Mussels", "Oysters", "Prawns", "Salmon", "Sardines", "Shrimp", "Snapper", "Squid", "Tilapia", "Tuna"],
  "Cans": ["Canned beans", "Canned beef", "Canned corn", "Canned fish", "Canned fruit", "Canned peas", "Canned tomatoes", "Canned vegetables", "Canned soup", "Canned tuna", "Canned sardines", "Baked beans", "Chickpeas", "Lentils"],
  "Jars": ["Apple sauce", "Jam", "Jelly", "Marmalade", "Mayonnaise", "Mustard", "Peanut butter", "Pickles", "Pasta sauce", "Salsa", "Tomato paste", "Olives", "Honey", "Chutney"],
  "Pasta, Rice & Cereals": ["Basmati rice", "Brown rice", "White rice", "Jasmine rice", "Parboiled rice", "Spaghetti", "Macaroni", "Penne", "Fusilli", "Lasagna", "Noodles", "Rice noodles", "Couscous", "Quinoa", "Oats", "Cornflakes", "Granola", "Muesli", "Bran cereal", "Weetabix"],
  "Sauces": ["BBQ sauce", "Chili sauce", "Hot sauce", "Pasta sauce", "Pizza sauce", "Soy sauce", "Steak sauce", "Sweet and sour sauce", "Teriyaki sauce", "Tomato sauce", "Worcestershire sauce", "Garlic sauce", "Pepper sauce", "Cheese sauce"],
  "Condiments": ["Ketchup", "Mayonnaise", "Mustard", "Relish", "Chutney", "Horseradish", "Honey", "Vinegar", "Pickles", "Salsa", "Marmalade", "Jam", "Peanut butter"],
  "Herbs": ["Basil", "Bay leaves", "Chives", "Cilantro", "Coriander", "Dill", "Lemongrass", "Mint", "Oregano", "Parsley", "Rosemary", "Sage", "Tarragon", "Thyme"],
  "Spices": ["Allspice", "Black pepper", "Cardamom", "Cayenne pepper", "Cinnamon", "Cloves", "Cumin", "Curry powder", "Fennel", "Garlic powder", "Ginger powder", "Nutmeg", "Paprika", "Red pepper flakes", "Saffron", "Salt", "Star anise", "Turmeric"],
  "Frozen Foods": ["Frozen vegetables", "Frozen peas", "Frozen corn", "Frozen chicken", "Frozen beef", "Frozen fish", "Frozen prawns", "Frozen pizza", "Frozen burgers", "Frozen fries", "Frozen fruit", "Ice cream", "Ice pops", "Frozen waffles", "Frozen meals"],
  "Snacks": ["Almonds", "Cashews", "Peanuts", "Popcorn", "Potato chips", "Tortilla chips", "Pretzels", "Crackers", "Cookies", "Granola bars", "Cereal bars", "Dried fruit", "Candy", "Chocolate", "Gummy sweets", "Trail mix", "Seeds"],
  "Drinks": ["Bottled water", "Sparkling water", "Soft drinks", "Cola", "Lemonade", "Fruit juice", "Orange juice", "Apple juice", "Energy drinks", "Sports drinks", "Coffee", "Tea", "Iced tea", "Hot chocolate", "Coconut water", "Smoothies"],
  "Household": ["Aluminum foil", "Batteries", "Coffee filters", "Garbage bags", "Light bulbs", "Napkins", "Paper plates", "Paper towels", "Plastic bags", "Plastic wrap", "Toilet paper", "Tissues", "Vacuum bags", "Wax paper", "Food storage containers"],
  "Cleaning": ["Bleach", "Dish soap", "Dishwasher detergent", "Disinfectant", "Fabric softener", "Floor cleaner", "Glass cleaner", "Laundry detergent", "Toilet cleaner", "Surface cleaner", "Sponges", "Scrub brushes", "Cleaning cloths", "Mop", "Broom", "Dustpan", "Air freshener"],
  "Personal Care": ["Body lotion", "Body wash", "Conditioner", "Deodorant", "Facial cleanser", "Hand soap", "Lip balm", "Mouthwash", "Perfume", "Razors", "Shampoo", "Shaving cream", "Shower gel", "Sunscreen", "Toothbrush", "Toothpaste", "Dental floss", "Cotton swabs", "Sanitary pads", "Tampons"],
  "Pet Care": ["Cat food", "Cat litter", "Cat treats", "Dog food", "Dog treats", "Flea treatment", "Pet shampoo", "Pet toys", "Poop bags", "Pet bedding"],
  "Baby Products": ["Baby food", "Baby formula", "Baby cereal", "Baby wipes", "Baby diapers", "Diaper cream", "Baby lotion", "Baby shampoo", "Baby soap", "Baby powder", "Baby bottles", "Pacifiers"]
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Drop existing tables
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS "products" CASCADE;');
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS "categories" CASCADE;');

    // 2. Create categories table with description and deletedAt
    await queryInterface.createTable('categories', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 3. Create products table with productImage and deletedAt
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      productImage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      categoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 4. Insert categories and products
    for (const [categoryName, products] of Object.entries(groceryData)) {
      const [results] = await queryInterface.sequelize.query(
        `INSERT INTO "categories" ("id", "name", "description", "createdAt", "updatedAt") 
         VALUES (gen_random_uuid(), :name, :description, NOW(), NOW()) 
         RETURNING "id";`,
        {
          replacements: { 
            name: categoryName,
            description: `All items under ${categoryName}`
          },
        }
      );

      const categoryId = results[0]?.id;

      if (categoryId && products.length > 0) {
        const productValues = products
          .map(
            (p) =>
              `(gen_random_uuid(), ${queryInterface.sequelize.escape(p)}, ${queryInterface.sequelize.escape(
                `Fresh ${p.toLowerCase()} under${categoryName}`
              )}, NULL, '${categoryId}', NOW(), NOW())`
          )
          .join(', ');

        await queryInterface.sequelize.query(
          `INSERT INTO "products" ("id", "name", "description", "productImage", "categoryId", "createdAt", "updatedAt") 
           VALUES ${productValues};`
        );
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS "products" CASCADE;');
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS "categories" CASCADE;');
  }
};