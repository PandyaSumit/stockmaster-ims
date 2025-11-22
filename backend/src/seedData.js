const mongoose = require('mongoose');
const Category = require('./models/Category');
const Warehouse = require('./models/Warehouse');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stockmaster-ims');
    console.log('✓ Connected to MongoDB');

    // Get the first admin user to assign as creator
    const adminUser = await User.findOne({ role: 'Admin' });
    if (!adminUser) {
      console.log('⚠ No admin user found. Please create an admin user first through signup.');
      process.exit(1);
    }
    console.log(`✓ Found admin user: ${adminUser.name}`);

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await Category.deleteMany({});
    // await Warehouse.deleteMany({});
    // await Product.deleteMany({});
    // console.log('✓ Cleared existing data');

    // Create Categories
    console.log('\nCreating categories...');
    const categories = [
      {
        name: 'Electronics',
        description: 'Electronic devices and components',
        isActive: true,
        createdBy: adminUser._id,
        lastUpdatedBy: adminUser._id,
      },
      {
        name: 'Furniture',
        description: 'Office and home furniture',
        isActive: true,
        createdBy: adminUser._id,
        lastUpdatedBy: adminUser._id,
      },
      {
        name: 'Office Supplies',
        description: 'Stationery and office equipment',
        isActive: true,
        createdBy: adminUser._id,
        lastUpdatedBy: adminUser._id,
      },
      {
        name: 'Food & Beverages',
        description: 'Food products and drinks',
        isActive: true,
        createdBy: adminUser._id,
        lastUpdatedBy: adminUser._id,
      },
      {
        name: 'Clothing & Apparel',
        description: 'Garments and accessories',
        isActive: true,
        createdBy: adminUser._id,
        lastUpdatedBy: adminUser._id,
      },
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log(`✓ Created ${createdCategories.length} categories`);

    // Create subcategories for Electronics
    const electronicsCategory = createdCategories.find(c => c.name === 'Electronics');
    const subcategories = [
      {
        name: 'Laptops',
        description: 'Laptop computers',
        parentCategory: electronicsCategory._id,
        isActive: true,
        createdBy: adminUser._id,
        lastUpdatedBy: adminUser._id,
      },
      {
        name: 'Mobile Phones',
        description: 'Smartphones and accessories',
        parentCategory: electronicsCategory._id,
        isActive: true,
        createdBy: adminUser._id,
        lastUpdatedBy: adminUser._id,
      },
      {
        name: 'Accessories',
        description: 'Electronic accessories',
        parentCategory: electronicsCategory._id,
        isActive: true,
        createdBy: adminUser._id,
        lastUpdatedBy: adminUser._id,
      },
    ];

    const createdSubcategories = await Category.insertMany(subcategories);
    console.log(`✓ Created ${createdSubcategories.length} subcategories`);

    // Create Warehouses
    console.log('\nCreating warehouses...');
    const warehouses = [
      {
        name: 'Main Warehouse',
        code: 'WH-MAIN',
        location: {
          address: '123 Industrial Park Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          pincode: '400001',
        },
        capacity: 10000,
        currentUtilization: 0,
        isActive: true,
        createdBy: adminUser._id,
        lastUpdatedBy: adminUser._id,
      },
      {
        name: 'North Warehouse',
        code: 'WH-NORTH',
        location: {
          address: '456 Storage Avenue',
          city: 'Delhi',
          state: 'Delhi',
          country: 'India',
          pincode: '110001',
        },
        capacity: 5000,
        currentUtilization: 0,
        isActive: true,
        createdBy: adminUser._id,
        lastUpdatedBy: adminUser._id,
      },
      {
        name: 'South Warehouse',
        code: 'WH-SOUTH',
        location: {
          address: '789 Logistics Street',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          pincode: '560001',
        },
        capacity: 7500,
        currentUtilization: 0,
        isActive: true,
        createdBy: adminUser._id,
        lastUpdatedBy: adminUser._id,
      },
    ];

    const createdWarehouses = await Warehouse.insertMany(warehouses);
    console.log(`✓ Created ${createdWarehouses.length} warehouses`);

    // Create Sample Products
    console.log('\nCreating sample products...');
    const laptopsCategory = createdSubcategories.find(c => c.name === 'Laptops');
    const mainWarehouse = createdWarehouses.find(w => w.code === 'WH-MAIN');

    const products = [
      {
        name: 'Dell Latitude 5420',
        sku: 'ELEC-LAPT-001',
        category: laptopsCategory._id,
        description: '14-inch business laptop with Intel i5 processor',
        unitOfMeasure: 'pieces',
        currentStock: 25,
        reorderLevel: 10,
        maxStockLevel: 50,
        autoReorderEnabled: true,
        warehouse: mainWarehouse._id,
        createdBy: adminUser._id,
        lastUpdatedBy: adminUser._id,
      },
      {
        name: 'HP EliteBook 840',
        sku: 'ELEC-LAPT-002',
        category: laptopsCategory._id,
        description: '14-inch premium business laptop',
        unitOfMeasure: 'pieces',
        currentStock: 15,
        reorderLevel: 8,
        maxStockLevel: 40,
        autoReorderEnabled: true,
        warehouse: mainWarehouse._id,
        createdBy: adminUser._id,
        lastUpdatedBy: adminUser._id,
      },
      {
        name: 'Lenovo ThinkPad X1',
        sku: 'ELEC-LAPT-003',
        category: laptopsCategory._id,
        description: 'Ultra-portable 13-inch business laptop',
        unitOfMeasure: 'pieces',
        currentStock: 5,
        reorderLevel: 10,
        maxStockLevel: 30,
        autoReorderEnabled: true,
        warehouse: mainWarehouse._id,
        createdBy: adminUser._id,
        lastUpdatedBy: adminUser._id,
      },
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`✓ Created ${createdProducts.length} sample products`);

    console.log('\n✅ Seed data created successfully!');
    console.log('\nSummary:');
    console.log(`  - Categories: ${createdCategories.length + createdSubcategories.length}`);
    console.log(`  - Warehouses: ${createdWarehouses.length}`);
    console.log(`  - Products: ${createdProducts.length}`);
    console.log('\nYou can now access the application and see the data!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData();
