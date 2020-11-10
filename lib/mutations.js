'use strict'

const connectDB = require('./db')
const { ObjectID } = require('mongodb')
const errorHandler = require('./errorHandler')

module.exports = {
    createCourse: async (root, { input }) => {
        let db, course

        const defaults = {
            teacher: '',
            topic: ''
        }

        try {
            db = await connectDB()
            course = await db.collection('courses').insertOne({ ...defaults, ...input })
            input._id = course.insertedId
        } catch (error) {
            errorHandler(error)
        }

        return input
    },
    editCourse: async (root, { _id, input }) => {
        let db, course

        try {
            db = await connectDB()
            await db.collection('courses').updateOne(
                { _id: ObjectID(_id) },
                { $set: input }
            )
            course = await db.collection('courses').findOne(
                { _id: ObjectID(_id) }
            )
        } catch (error) {
            errorHandler(error)
        }

        return course
    },
    addPeople: async (root, { courseId, personId  }) => {
        let db, course, person

        try {
            db = await connectDB()

            course = await db.collection('courses').findOne(
                { _id: ObjectID(courseId) }
            )

            person = await db.collection('students').findOne(
                { _id: ObjectID(personId) }
            )
            
            if (!course || !person) throw new Error('El curso o la persona no existe ');

            await db.collection('courses').updateOne(
                { _id: ObjectID(courseId) },
                { $addToSet: { people:  ObjectID(personId)} }
            );

            return course
        } catch (error) {
            errorHandler(error)
        }
    },
    createPerson: async (root, { input }) => {
        let db, student

        try {
            db = await connectDB()
            student = await db.collection('students').insertOne({ ...input })
            input._id = student.insertedId
        } catch (error) {
            errorHandler(error)
        }

        return input
    },
    editPerson: async (root, { _id, input }) => {
        let db, student

        try {
            db = await connectDB()
            await db.collection('students').updateOne(
                { _id: ObjectID(_id) },
                { $set: input }
            )
            student = await db.collection('students').findOne(
                { _id: ObjectID(_id) }
            )
        } catch (error) {
            errorHandler(error)
        }

        return student
    },
    deleteElement: async (root, { _id, collection }) => {
        let db, element

        try {
            db = await connectDB()
            element = await db.collection(collection).findOneAndDelete(
                { _id: ObjectID(_id) }
            )
        } catch (error) {
            errorHandler(error)
        }

        return element ? true : false
    }
}
