# PetStore

Simple CRUD APIs for Pets management, Order management and User management.

#### For Installation Dependencies Run:

```http
npm i
```

#### For Start Server Run:

```http
nodemon index.js
```

#### Server Is Running On:

```http
http://localhost:1024/
```

## API Reference

#### Add Pet

```http
  POST /pet
```

| Parameter  | Type     | Description                              |
| :--------- | :------- | :--------------------------------------- |
| `name`     | `string` | **Required**. Pet Name                   |
| `tags`     | `string` | **Required**. Tags                       |
| `status`   | `enum`   | **Required**. [available, pending, sold] |
| `category` | `string` | **Required**. Pet Category               |
| `photoURL` | `string` | **Optional**. Image                      |

#### Pet List

```http
  GET /pet
```

#### Pet Update

```http
  PUT /pet/:id
```

| Parameter  | Type      | Description                               |
| :--------- | :-------- | :---------------------------------------- |
| `id`       | `integer` | **Required**. Pet ID                      |
| `name`     | `string`  | **Optional**. Pet Name                    |
| `tags`     | `string`  | **Optional**. Tags                        |
| `status`   | `enum`    | **Optional**.. [available, pending, sold] |
| `category` | `string`  | **Optional**. Pet Category                |
| `file`     | `string`  | **Optional**. Image                       |

#### Upload Image

```http
  POST /pet/:id/uploadImage
```

| Parameter | Type      | Description          |
| :-------- | :-------- | :------------------- |
| `id`      | `integer` | **Required**. Pet ID |
| `file`    | `string`  | **Required**. Image  |

#### Pet Detail

```http
  GET /pet/:id
```

| Parameter | Type      | Description          |
| :-------- | :-------- | :------------------- |
| `id`      | `integer` | **Required**. Pet ID |

#### Delete Pet

```http
  DELETE /pet/:id
```

| Parameter | Type      | Description          |
| :-------- | :-------- | :------------------- |
| `id`      | `integer` | **Required**. Pet ID |

#### Fetch Pet List By Tag

```http
  GET /pet/byTag/:tag
```

| Parameter | Type     | Description        |
| :-------- | :------- | :----------------- |
| `tags`    | `string` | **Required**. Tags |

#### Fetch Pet List By Status

```http
  GET /pet/byStatus/:status
```

| Parameter | Type   | Description                              |
| :-------- | :----- | :--------------------------------------- |
| `status`  | `enum` | **Optional**. [available, pending, sold] |

#### Place Order

```http
  POST /store/order
```

| Parameter  | Type     | Description                                   |
| :--------- | :------- | :-------------------------------------------- |
| `petId`    | `string` | **Required**. Pet ID                          |
| `quantity` | `string` | **Required**. Number of pets                  |
| `shipDate` | `string` | **Required**. format-2023-07-22T21:09:54+0000 |
| `complete` | `string` | **Required**. Boolean                         |

#### Order Detail

```http
  GET /store/order/:id
```

| Parameter | Type      | Description            |
| :-------- | :-------- | :--------------------- |
| `id`      | `integer` | **Required**. Order ID |

#### Delete Order

```http
  DELETE /store/order/:id
```

| Parameter | Type      | Description            |
| :-------- | :-------- | :--------------------- |
| `id`      | `integer` | **Required**. Order ID |

#### Fetch Order List By Order Status

```http
  DELETE /store/inventory/:status
```

| Parameter | Type   | Description                                 |
| :-------- | :----- | :------------------------------------------ |
| `status`  | `enum` | **Required**. [placed, approved, delivered] |

#### Create User

```http
  POST /user
```

| Parameter   | Type     | Description             |
| :---------- | :------- | :---------------------- |
| `username`  | `string` | **Required**. Unique    |
| `firstname` | `string` | **Required**. Firstname |
| `lastname`  | `string` | **Required**. Lastname  |
| `email`     | `email`  | **Required**. Unique    |
| `password`  | `string` | **Required**. Password  |
| `phone`     | `string` | **Required**. Phone     |

#### User Login

```http
  GET /user/login
```

| Parameter  | Type     | Description            |
| :--------- | :------- | :--------------------- |
| `username` | `string` | **Required**. Unique   |
| `password` | `string` | **Required**. Password |

#### User Logout

```http
  GET /user/logout
```

#### Update User

```http
  PUT /user/:username
```

| Parameter   | Type     | Description             |
| :---------- | :------- | :---------------------- |
| `username`  | `string` | **Optional**. Unique    |
| `firstname` | `string` | **Optional**. Firstname |
| `lastname`  | `string` | **Optional**. Lastname  |
| `email`     | `email`  | **Optional**. Unique    |
| `password`  | `string` | **Optional**. Password  |
| `phone`     | `string` | **Optional**. Phone     |

#### User Detail By Username

```http
  GET /user/:username
```

#### User DELETE

```http
  DELETE /user/:username
```

#### Create Users With Array

```http
  POST /user/createWithArray
```
