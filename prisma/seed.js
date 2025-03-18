import {
  PrismaClient,
  Role,
  PaymentMethod,
  PaymentStatus,
  OrderStatus,
  ShippingStatus
} from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Menambahkan Admin, Seller, dan User
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@validemail.com', // Pastikan email valid dan unik
      password: await bcrypt.hash('adminpassword', 10),
      role: Role.admin,
      phone: '1234567890',
      address: '123 Admin St.'
    }
  })

  const seller1 = await prisma.user.create({
    data: {
      name: 'Seller One',
      email: 'seller1@validemail.com', // Pastikan email valid dan unik
      password: await bcrypt.hash('sellerpassword', 10),
      role: Role.seller,
      phone: '1234567890',
      address: '123 Seller St.'
    }
  })

  const seller2 = await prisma.user.create({
    data: {
      name: 'Seller Two',
      email: 'seller2@validemail.com', // Pastikan email valid dan unik
      password: await bcrypt.hash('sellerpassword', 10),
      role: Role.seller,
      phone: '1234567890',
      address: '456 Seller St.'
    }
  })

  const user1 = await prisma.user.create({
    data: {
      name: 'User One',
      email: 'user1@validemail.com', // Pastikan email valid dan unik
      password: await bcrypt.hash('userpassword', 10),
      role: Role.user,
      phone: '1234567890',
      address: '789 User St.'
    }
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'User Two',
      email: 'user2@validemail.com', // Pastikan email valid dan unik
      password: await bcrypt.hash('userpassword', 10),
      role: Role.user,
      phone: '1234567890',
      address: '101 User St.'
    }
  })

  // Menambahkan kategori (Kategori wajib ada terlebih dahulu)
  const category1 = await prisma.category.create({
    data: {
      name: 'Electronics',
      description: 'Various electronic products.'
    }
  })

  const category2 = await prisma.category.create({
    data: {
      name: 'Home Appliances',
      description: 'Products for home use.'
    }
  })

  // Menambahkan 10 produk (pastikan kategori sudah ada)
  const products = []
  for (let i = 1; i <= 10; i++) {
    const product = await prisma.product.create({
      data: {
        name: `Product ${i}`,
        description: `Description for product ${i}`,
        price: Math.floor(Math.random() * 1000) + 10,
        stock: Math.floor(Math.random() * 100) + 1,
        sellerId: seller1.id,
        categoryId: category1.id // Menggunakan kategori yang sudah ada
      }
    })
    products.push(product)
  }

  // Menambahkan 10 pesanan
  const orders = []
  for (let i = 1; i <= 10; i++) {
    const order = await prisma.order.create({
      data: {
        totalAmount: Math.floor(Math.random() * 1000) + 100,
        status: OrderStatus.pending,
        buyerId: user1.id,
        orderItems: {
          create: [
            {
              productId: products[i % 10].id,
              quantity: Math.floor(Math.random() * 5) + 1,
              price: products[i % 10].price
            }
          ]
        },
        payment: {
          create: {
            amount: Math.floor(Math.random() * 1000) + 100,
            paymentMethod: PaymentMethod.credit_card,
            status: PaymentStatus.pending
          }
        },
        shipping: {
          create: {
            trackingNumber: `TRACK-${i}`,
            status: ShippingStatus.pending,
            shippingDate: new Date()
          }
        }
      }
    })
    orders.push(order)
  }

  // Menambahkan transaksi
  for (let i = 1; i <= 5; i++) {
    await prisma.transaction.create({
      data: {
        userId: user1.id,
        orderId: orders[i % 10].id,
        amount: Math.floor(Math.random() * 1000) + 100,
        status: PaymentStatus.completed
      }
    })
  }

  console.log('Seed data has been successfully created!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
