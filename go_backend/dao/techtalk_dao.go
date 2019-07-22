package dao

import (
	"context"
	"fmt"
	"go_backend/models"
	"os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	//DBName database name
	DBName = "fntdb"
	//TECHCOLL mongo collection
	TECHCOLL = "techtalk"
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
		fmt.Println(err)
	}
	// Collection types can be used to access the database
	db = client.Database(DBName)
	fmt.Println("Connection success to Database:: ", db.Name())
}

// InsertOneTalk inserts one item from TechTalk model
func InsertOneTalk(TechTalk models.TechTalk) {
	_, err := db.Collection(TECHCOLL).InsertOne(context.Background(), TechTalk)
	if err != nil {
		fmt.Println(err)
	}
}

// GetAlltechtalk returns all techtalk from DB
func GetAlltechtalk() []models.TechTalk {
	cur, err := db.Collection(TECHCOLL).Find(context.Background(), bson.D{}, nil)
	if err != nil {
		fmt.Println(err)
	}
	var elements []models.TechTalk
	var elem models.TechTalk
	// Get the next result from the cursor
	for cur.Next(context.Background()) {
		err := cur.Decode(&elem)
		if err != nil {
			fmt.Println(err)
		}
		elements = append(elements, elem)
	}
	if err := cur.Err(); err != nil {
		fmt.Println(err)
	}
	cur.Close(context.Background())
	return elements
}

// DeleteTechTalk deletes an existing TechTalk
func DeleteTechTalk(TechTalkID string) {
	objectIDS, err := primitive.ObjectIDFromHex(TechTalkID)
	if err != nil {
		fmt.Printf("deleteTask: couldn't convert to-do ID from input: %v", err)
	}
	_, err = db.Collection(TECHCOLL).DeleteOne(context.Background(), bson.D{{"_id", objectIDS}})
	if err != nil {
		fmt.Println(err)
	}
}

// UpdateTechTalk updates an existing TechTalk
func UpdateTechTalk(TechTalk models.TechTalk) {
	_, err := db.Collection(TECHCOLL).UpdateOne(
		context.Background(),
		bson.M{"_id": TechTalk.ID},
		bson.M{
			"$set": TechTalk,
		},
	)
	if err != nil {
		fmt.Println(err)
	}
}

//UpdateImageTechTalk update image
func UpdateImageTechTalk(TechTalk models.TechTalk) {
	_, err := db.Collection(TECHCOLL).UpdateOne(
		context.Background(),
		bson.M{"_id": TechTalk.ID},
		bson.M{
			"$set": bson.M{
				"photoUri": TechTalk.PhotoUri,
			},
		},
	)
	if err != nil {
		fmt.Println(err)
	}
}
