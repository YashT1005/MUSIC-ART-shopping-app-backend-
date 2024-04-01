const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Invoive = require("../models/Invoive");

const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model("Product", productSchema, "products");

exports.createCart = async (req, res) => {
    try {
        const { id } = req.body;

        const existingCartData = await Cart.findOne({ ref: req.body.userId });

        const product = await Product.findById(id);

        if (existingCartData) {
            let newCart = existingCartData.cart.filter(
                (item) => item.productId.toHexString() === id
            );
            if (newCart[0]) {
                if (existingCartData.cart.filter(
                    (item) => item.productId.toHexString() === id
                )[0].quantity === 8) {
                    return res.status(200).json({
                        success: false,
                        message: "Quantity limit increased",
                    });
                }
                existingCartData.cart.filter(
                    (item) => item.productId.toHexString() === id
                )[0].quantity = ++newCart[0].quantity;
                await existingCartData.save();
            } else {
                existingCartData.cart.push({ productId: id, quantity: 1 });
                await existingCartData.save();
            }
            return res.status(200).json({
                success: true,
                message: "Quantity modified successfully",
            });
        }

        await Cart.create({
            cart: [{ productId: id, quantity: 1 }],
            ref: req.body.userId,
        });

        return res.status(200).json({
            success: true,
            message: "Added to cart successfully",
        });
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};
exports.deleteCart = async (req, res) => {
    try {

        const existingCartData = await Cart.findOne({ ref: req.body.userId });

        if (existingCartData) {
            await Cart.deleteOne();
            return res.status(200).json({
                success: true,
                message: "Cart deleted successfully",
            });
        }

    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getAllData = async (req, res) => {
    try {
        const name = req.query.name || "";
        const type = req.query.type || "";
        const brand = req.query.brand || "";
        const color = req.query.color || "";
        const minPrice = parseInt(req.query.minPrice) || 0;
        const maxPrice = parseInt(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;
        const sortType = req.query.sortType || ""; // 'priceAsc', 'priceDesc', 'nameAsc', 'nameDesc' (default: '')

        // Define the sort options based on the sortType
        let sortOptions = {};
        if (sortType === "priceAsc") {
            sortOptions = { price: 1 }; // Sort by price in ascending order
        } else if (sortType === "priceDesc") {
            sortOptions = { price: -1 }; // Sort by price in descending order
        } else if (sortType === "nameAsc") {
            sortOptions = { name: 1 }; // Sort by name in ascending order
        } else if (sortType === "nameDesc") {
            sortOptions = { name: -1 }; // Sort by name in descending order
        }

        // Construct the query object with filtering conditions
        const query = {
            name: { $regex: name, $options: "i" },
            type: { $regex: type, $options: "i" },
            brand: { $regex: brand, $options: "i" },
            color: { $regex: color, $options: "i" },
            price: { $gte: minPrice, $lte: maxPrice }, // Filter by price within the specified range
        };

        // Fetch filtered and sorted data
        const filteredData = await Product.find(query).sort(sortOptions);

        return res.status(200).json({
            success: true,
            data: filteredData,
        });
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getCartData = async (req, res) => {
    try {
        const cartData = await Cart.findOne({ ref: req.body.userId });
        if (cartData) {
            let products = [];
            let overallQuantity = 0;

            const productPromises = cartData.cart.map(async (item) => {
                const product = await Product.findById(item.productId);
                overallQuantity = overallQuantity + item.quantity;
                const data = { productData: product, quantity: item.quantity };
                return data;
            });

            const resolvedProducts = await Promise.all(productPromises);

            // Add resolved products to the products array
            products = resolvedProducts.filter((product) => product);

            return res.status(200).json({
                success: true,
                data: products,
                overallQuantity: overallQuantity,
            });
        } else {
            return res.status(200).json({
                success: true,
                data: "No products in the cart",
                overallQuantity: 0,
            });
        }
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getProductDetails = async (req, res) => {
    try {
        const id = req.query.id;
        const product = await Product.findById(id);
        if (product) {
            return res.status(200).json({
                success: true,
                data: product,
            });
        }
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};

exports.modifyCartValue = async (req, res) => {
    try {
        const { id, quantity } = req.body;

        const existingCartData = await Cart.findOne({ ref: req.body.userId });

        const product = await Product.findById(id);

        if (existingCartData) {
            let newCart = existingCartData.cart.filter(
                (item) => item.productId.toHexString() === id
            );
            if (newCart[0]) {
                existingCartData.cart.filter(
                    (item) => item.productId.toHexString() === id
                )[0].quantity = quantity;
                await existingCartData.save();
            }
            return res.status(200).json({
                success: true,
                message: "Quantity modified successfully",
            });
        }


    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createInvoice = async (req, res) => {
    try {
        const { data, address, mode } = req.body;



        await Invoive.create({
            data: data,
            address: address,
            mode, mode,
            ref: req.body.userId,
        });

        return res.status(200).json({
            success: true,
            message: "Invoice created successfully",
        });


    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getInvoice = async (req, res) => {
    try {
        const invoice = await Invoive.find({ ref: req.body.userId })

        if (invoice) {

            return res.status(200).json({
                count: invoice.length,
                success: true,
                data: invoice,
                message: "Invoice returned successfully",
            });
        } else {
            return res.status(200).json({
                success: false,
                message: "No data",
            });
        }


    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};



