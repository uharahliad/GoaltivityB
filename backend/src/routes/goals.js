const express = require('express');

const GoalsService = require('../services/goals');
const GoalsDBApi = require('../db/api/goals');
const wrapAsync = require('../helpers').wrapAsync;

const router = express.Router();

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Goals:
 *        type: object
 *        properties:

 *          name:
 *            type: string
 *            default: name
 *          award:
 *            type: string
 *            default: award

 */

/**
 *  @swagger
 * tags:
 *   name: Goals
 *   description: The Goals managing API
 */

/**
 *  @swagger
 *  /api/goals:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags: [Goals]
 *      summary: Add new item
 *      description: Add new item
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                data:
 *                  description: Data of the updated item
 *                  type: object
 *                  $ref: "#/components/schemas/Goals"
 *      responses:
 *        200:
 *          description: The item was successfully added
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Goals"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        405:
 *          description: Invalid input data
 *        500:
 *          description: Some server error
 */

router.post('/', async (req, res) => {
  const payload = await GoalsService.create(
    req.body.data,
    true,
    req.headers.referer,
  );
  res.status(200).send(payload);
});

/**
 *  @swagger
 *  /api/goals/{id}:
 *    put:
 *      security:
 *        - bearerAuth: []
 *      tags: [Goals]
 *      summary: Update the data of the selected item
 *      description: Update the data of the selected item
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Item ID to update
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *        description: Set new item data
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                id:
 *                  description: ID of the updated item
 *                  type: string
 *                data:
 *                  description: Data of the updated item
 *                  type: object
 *                  $ref: "#/components/schemas/Goals"
 *              required:
 *                - id
 *      responses:
 *        200:
 *          description: The item data was successfully updated
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Goals"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Item not found
 *        500:
 *          description: Some server error
 */

router.put(
  '/:id',
  wrapAsync(async (req, res) => {
    await GoalsService.update(req.body.data, req.params.id, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
  }),
);

/**
 * @swagger
 *  /api/goals/{id}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags: [Goals]
 *      summary: Delete the selected item
 *      description: Delete the selected item
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Item ID to delete
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: The item was successfully deleted
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Goals"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Item not found
 *        500:
 *          description: Some server error
 */

router.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    await GoalsService.remove(req.params.id, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
  }),
);

/**
 *  @swagger
 *  /api/goals:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Goals]
 *      summary: Get all goals
 *      description: Get all goals
 *      responses:
 *        200:
 *          description: Goals list successfully received
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/Goals"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Data not found
 *        500:
 *          description: Some server error
 */

router.get(
  '/:author',
  wrapAsync(async (req, res) => {
    // console.log(req.params, '/////////////////////////////////')
    const payload = await GoalsDBApi.findAll(req.params);
    // console.log(payload)
    res.status(200).send(payload);
  }),
);

router.get('/autocomplete', async (req, res) => {
  const payload = await GoalsDBApi.findAllAutocomplete(
    req.query.query,
    req.query.limit,
  );

  res.status(200).send(payload);
});

/**
 * @swagger
 *  /api/goals/{id}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Goals]
 *      summary: Get selected item
 *      description: Get selected item
 *      parameters:
 *        - in: path
 *          name: id
 *          description: ID of item to get
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Selected item successfully received
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Goals"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Item not found
 *        500:
 *          description: Some server error
 */

router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    const payload = await GoalsDBApi.findBy({ id: req.params.id });

    res.status(200).send(payload);
  }),
);

router.use('/', require('../helpers').commonErrorHandler);

module.exports = router;
