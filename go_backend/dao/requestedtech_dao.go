package dao

import (
	"context"
	"fmt"
	"go_backend/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	//REQUESTTECH mongo collection
	REQUESTTECH = "requestedtalk"
)

// InsertRequestedTalk inserts one item from RequestedTalk model
func InsertRequestedTalk(RequestedTalk models.RequestedTalk) {
	_, err := db.Collection(REQUESTTECH).InsertOne(context.Background(), RequestedTalk)
	if err != nil {
		fmt.Println(err)
	}
}

// GetAllRequestedTalks returns all techtalk from DB
func GetAllRequestedTalks() []models.RequestedTalk {
	cur, err := db.Collection(REQUESTTECH).Find(context.Background(), bson.D{}, nil)
	if err != nil {
		fmt.Println(err)
	}
	var elements []models.RequestedTalk
	var elem models.RequestedTalk
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

// DeleteRequestedTalk deletes an existing RequestedTalk
func DeleteRequestedTalk(RequestedTalkID string) {
	objectIDS, err := primitive.ObjectIDFromHex(RequestedTalkID)
	if err != nil {
		fmt.Printf("deleteTask: couldn't convert to-do ID from input: %v", err)
	}
	_, err = db.Collection(REQUESTTECH).DeleteOne(context.Background(), bson.D{{"_id", objectIDS}})
	if err != nil {
		fmt.Println(err)
	}
}

// UpdateRequestedTalk updates an existing RequestedTalk
func UpdateRequestedTalk(RequestedTalk models.RequestedTalk) {
	_, err := db.Collection(REQUESTTECH).UpdateOne(
		context.Background(),
		bson.M{"_id": RequestedTalk.ID},
		bson.M{
			"$set": RequestedTalk,
		},
	)
	if err != nil {
		fmt.Println(err)
	}
}

// PromoteRequestedTalk updates an existing RequestedTalk
func PromoteRequestedTalk(RequestedTalk models.RequestedTalk) {
	_, err := db.Collection(REQUESTTECH).UpdateOne(
		context.Background(),
		bson.M{"_id": RequestedTalk.ID},
		bson.M{
			"$set": bson.M{
				"promoted": RequestedTalk.Promoted,
			},
		},
	)
	if err != nil {
		fmt.Println(err)
	}
}

//UpdateImageReqTalk update image
func UpdateImageReqTalk(RequestedTalk models.RequestedTalk) {
	_, err := db.Collection(REQUESTTECH).UpdateOne(
		context.Background(),
		bson.M{"_id": RequestedTalk.ID},
		bson.M{
			"$set": bson.M{
				"photouri": RequestedTalk.PhotoUri,
			},
		},
	)
	if err != nil {
		fmt.Println(err)
	}
}
