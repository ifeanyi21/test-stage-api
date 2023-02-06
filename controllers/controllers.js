const { MongoClient, ObjectId } = require("mongodb");
const JWT = require("jsonwebtoken");
require("dotenv").config();

const url = "mongodb+srv://admin-kamsey:D1MX02jndmNBE7OE@cluster0.wf7xh.mongodb.net/?retryWrites=true&w=majority";
const dbName = "DevTestDb";
const client = new MongoClient(url);

exports.login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("users");

    const foundUser = await collection.findOne({
      seller_id: userName,
      seller_zip_code_prefix: password,
    });

    client.close();

    if (foundUser) {
      const token = JWT.sign(
        {
          sellerId: foundUser.seller_id,
          id: foundUser._id,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );
      return res.status(200).json({
        status: true,
        user: {
          sellerId: foundUser.seller_id,
          id: foundUser._id,
        },
        token,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Incorrect Credentials, Try again",
        user: false,
      });
    }
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Ooops an Error Occurred, Try again" });
  }
};

exports.orders = async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("orders");
    const category = db.collection("productCategeory");
    const products = db.collection("products");

    const foundOrders = await collection
      .find({
        seller_id: res.user.sellerId,
      })
      .limit(parseInt(req.query.limit))
      .sort({ shipping_limit_date: -1 })
      .toArray();

    const total = foundOrders.reduce((sum, item) => {
      return parseFloat(item.price) + sum;
    }, 0);

    const allProducts = await products.find({}).toArray();

    const data = foundOrders.map((order, index) => {
      const prod = allProducts.filter(
        (item) => item.product_id === order.product_id
      );

      return {
        dbId: order._id,
        id: order.order_item_id,
        product_id: order.product_id,
        product_category: prod[0].product_category_name,
        price: order.price,
        date: order.shipping_limit_date,
      };
    });

    //client.close();

    return res.status(200).json({
      foundOrders: { data, total: total.toFixed(2), limit: 20, offset: 560 },
      status: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ status: false });
  }
};

exports.viewOrder = async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("orders");
    const products = db.collection("products");

    const foundOrder = await collection.findOne({
      _id: new ObjectId(req.params.id),
    });

    const productInfo = await products.findOne({
      product_id: foundOrder.product_id,
    });

    //client.close();

    return res.status(200).json({
      status: true,
      foundOrder,
      productInfo,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ status: false });
  }
};

exports.userInfo = async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("users");

    const foundUser = await collection.findOne({
      _id: new ObjectId(res.user.id),
    });

    return res.status(200).json({ status: true, foundUser });
  } catch (error) {
    return res.status(400).json({ status: false });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { city, state } = req.body;
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("users");

    await collection.findOneAndUpdate(
      {
        _id: new ObjectId(res.user.id),
      },
      { $set: { seller_city: city, seller_state: state } }
    );

    const updateUser = await collection.findOne({
      _id: new ObjectId(res.user.id),
    });

    client.close();

    return res.status(200).json({ status: true, updateUser });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false });
  }
};

exports.editOrder = async (req, res) => {
  try {
    const { price, freightValue } = req.body;
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("orders");

    await collection.updateOne(
      {
        _id: new ObjectId(req.params.id),
      },
      { $set: { price: price, freight_value: freightValue } }
    );

    client.close();

    return res.status(200).json({ status: true });
  } catch (error) {}
};

exports.deleteOrder = async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("orders");

    await collection.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    client.close();

    return res.status(200).json({ status: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false });
  }
};
