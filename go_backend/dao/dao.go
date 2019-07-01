package dao

import (
	"context"
	"fmt"
	"go_backend/models"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	//DBName database name
	DBName = "fntdb"
	//COLLNAME mongo collection
	COLLNAME = "techtalk"
)

var db *mongo.Database

// Connect establish a connection to database
func init() {
	ctx := context.Background()
	URI := os.Getenv("DATABASE_URL")
	if URI == "" {
		URI = "mongodb://@localhost:27017"
	}
	fmt.Println("Mongodb connection details:: ", URI)
	clientOpts := options.Client().ApplyURI(URI)
	client, err := mongo.Connect(ctx, clientOpts)
	if err != nil {
		log.Println(err)
	}
	// Collection types can be used to access the database
	db = client.Database(DBName)
	fmt.Println("Connection success to Database:: ", db.Name())
}

// InsertManyValues inserts many items from byte slice
func InsertManyValues(techtalk []models.TechTalk) {
	var ttk []interface{}
	for _, p := range techtalk {
		ttk = append(ttk, p)
	}
	_, err := db.Collection(COLLNAME).InsertMany(context.Background(), ttk)
	if err != nil {
		log.Println(err)
	}
}

// InsertOneValue inserts one item from TechTalk model
func InsertOneValue(TechTalk models.TechTalk) {
	fmt.Println(TechTalk)
	_, err := db.Collection(COLLNAME).InsertOne(context.Background(), TechTalk)
	if err != nil {
		log.Println(err)
	}
}

// GetAlltechtalk returns all techtalk from DB
func GetAlltechtalk() []models.TechTalk {
	cur, err := db.Collection(COLLNAME).Find(context.Background(), bson.D{}, nil)
	if err != nil {
		log.Println(err)
	}
	var elements []models.TechTalk
	var elem models.TechTalk
	// Get the next result from the cursor
	for cur.Next(context.Background()) {
		err := cur.Decode(&elem)
		if err != nil {
			log.Println(err)
		}
		elements = append(elements, elem)
	}
	if err := cur.Err(); err != nil {
		log.Println(err)
	}
	cur.Close(context.Background())
	return elements
}

// DeleteTechTalk deletes an existing TechTalk
func DeleteTechTalk(TechTalk models.TechTalk) {
	_, err := db.Collection(COLLNAME).DeleteOne(context.Background(), TechTalk, nil)
	if err != nil {
		log.Println(err)
	}
}

// UpdateTechTalk updates an existing TechTalk
func UpdateTechTalk(TechTalk models.TechTalk, TechTalkID string) {

}
