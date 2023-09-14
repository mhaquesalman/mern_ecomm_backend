const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const { Product, validate } = require('../models/product');
const { Comment } = require('../models/Comment')
const { Purchase } = require('../models/Purchase')

module.exports.createProduct = async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).send("Something went wrong!");
        const { error } = validate(_.pick(fields, ["name", "description", "price", "category", "quantity", "rating", "sold"]));
        if (error) return res.status(400).send(error.details[0].message);

        const product = new Product(fields);
       
        if (files.photo) {
            // console.log("photo ", files.photo)
            // <input type="file" name="photo" />
            fs.readFile(files.photo.filepath, (err, data) => {
                if (err) return res.status(400).send("Problem in file data!");
                product.photo.data = data;
                product.photo.contentType = files.photo.mimetype;
                // console.log("product ", product)
                product.save((err, result) => {
                    if (err) res.status(500).send("Internal Server error!");
                    else return res.status(201).send({
                        message: "Product Created Successfully!",
                        data: _.pick(result, ["name", "description", "price", "category", "quantity", "rating", "sold"])
                    })
                })
            })
        } else {
            return res.status(400).send("No image provided!");
        }
    })
}

// api/product?order=desc&&sortBy=name&limit=10
module.exports.getProducts = async (req, res) => {
    let order = req.query.order === 'desc' ? -1 : 1;
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let skip = req.query.skip ? parseInt(req.query.skip) : 0
    const products = await Product.find()
        .select({ photo: 0 })
        .sort({ [sortBy]: order })
        .populate('category', 'name')
        .skip(skip)
        .limit(limit)
    return res.status(200).send(products);
}

module.exports.getProductById = async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId)
        .select({ photo: 0 })
        .populate('category', 'name');
    if (!product) res.status(404).send("Not Found!");
    return res.status(200).send(product);
}

module.exports.getPhoto = async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId)
        .select({ photo: 1, _id: 0 })
    res.set('Content-Type', product.photo.contentType);
    return res.status(200).send(product.photo.data);
}

module.exports.updateProductById = async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    // console.log("product ", product)
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).send("Something wrong!");
        const updatedFields = _.pick(fields, ["name", "description", "price", "category", "quantity", "rating", "sold"]);
        _.assignIn(product, updatedFields);

        if (files.photo) {
            fs.readFile(files.photo.filepath, (err, data) => {
                if (err) return res.status(400).send("Something wrong!");
                product.photo.data = data;
                product.photo.contentType = files.photo.mimetype;
                product.save((err, result) => {
                    if (err) return res.status(500).send("Something failed!");
                    else return res.status(200).send({
                        message: "Product Updated Successfully!"
                    })
                })
            })
        } else {
            product.save((err, result) => {
                if (err) return res.status(500).send("Something failed!");
                else return res.status(200).send({
                    message: "Product Updated Successfully!"
                })
            })
        }
    })
}

const body = {
    order: 'desc',
    sortBy: 'price',
    limit: 6,
    skip: 20,
    filters: {
        price: [1000, 2000],
        category: ['604cc12312312', '60743dfgfdgfd', '60743dfdsfdd']
    }
}
module.exports.filterProducts = async (req, res) => {
    let order = req.body.order === 'desc' ? -1 : 1;
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = parseInt(req.body.skip);
    let filters = req.body.filters;
    let args = {}

    for (let key in filters) {
        if (filters[key].length > 0) {
            if (key === 'price') {
                // { price: {$gte: 0, $lte: 1000 }}
                args['price'] = {
                    $gte: filters['price'][0],
                    $lte: filters['price'][1]
                }
                console.log("args:", args);
            }
            if (key === 'category') {
                // category: { $in: [''] }
                args['category'] = {
                    $in: filters['category']
                }
                console.log("args:", args);
            }
        }
    }

    const products = await Product.find(args)
        .select({ photo: 0 })
        .sort({ [sortBy]: order })
        .populate('category', 'name')
        .skip(skip)
        .limit(limit)
    return res.status(200).send(products);
}

module.exports.searchProduct = async (req, res) => {
  let q = req.query.q ? req.query.q : "";
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;

  try {
    const products = await Product.aggregate([
      {
        $search: {
          index: "search-product",
          text: {
            query: q,
            path: {
              wildcard: "*",
            },
          },
        },
      },
      {
        $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category"

        }
      },
      {
        $project: {
          photo: 0,
        },
      },
      {
        $limit: limit
      }
    ])
    //   console.log(products)
      return res.status(200).send(products);
    } catch (err) {
      console.log(err)
      return res.status(200).send(err);
  }

}

const productIds = {
  tid: "aafaf",
  pids: [
    {
      id: 'aasas',
      count: 1
    },
    {
      id: 'adddf',
      count: 1
    }
  ]
}

module.exports.updateProductSoldAndQuantity = async (req, res) => {
  const tid = req.body.tid
  const pids = req.body.pids
 
  pids.forEach(p => {
    Product.findById(p.id)
        .then( async (data) => {
          const { quantity } = data
          const newSold = p.count
          const newQuantity = quantity - newSold
          Product.updateOne({ _id: p.id }, { quantity: newQuantity, sold: newSold})
          await Purchase.updateOne({ transaction_id: tid }, { status: 'Complete' })
        })
  });
  return res.status(200).send("Item updated!");
}

/* module.exports.sortyByProductRating = async (req, res) => {
  let q = req.query.q ? req.query.q : "";
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;

  try {
    const comments = await Comment.aggregate([
        {
          $match: { product: q },
        },
        {
          $lookup: {
            from: "products",
            localField: "product",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $project: {
            photo: 0,
          },
        },
        {
          $limit: limit,
        },
      ]);
      console.log(comments)
      return res.status(200).send("passed");
  } catch (err) {
    return res.status(200).send("failed " + err)
  }
} */


module.exports.test = (req, res) => {
    return res.send('hello')
}

