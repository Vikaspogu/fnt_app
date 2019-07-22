package dao

import (
	"context"
	"fmt"
	"go_backend/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	//REQUESTSOCIAL mongo collection
	REQUESTSOCIAL = "requestedsocial"
)

// InsertRequestedSocial inserts one item from RequestedSocial model
func InsertRequestedSocial(RequestedSocial models.RequestedSocial) {
	_, err := db.Collection(REQUESTSOCIAL).InsertOne(context.Background(), RequestedSocial)
	if err != nil {
		fmt.Println(err)
	}
}

// GetAllRequestedSocial returns all Requested Social from DB
func GetAllRequestedSocial() []models.RequestedSocial {
	cur, err := db.Collection(REQUESTSOCIAL).Find(context.Background(), bson.D{}, nil)
	if err != nil {
		fmt.Println(err)
	}
	var elements []models.RequestedSocial
	var elem models.RequestedSocial
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

// DeleteRequestedSocial deletes an existing RequestedSocial
func DeleteRequestedSocial(RequestedSocialID string) {
	objectIDS, err := primitive.ObjectIDFromHex(RequestedSocialID)
	if err != nil {
		fmt.Printf("deleteTask: couldn't convert to-do ID from input: %v", err)
	}
	_, err = db.Collection(REQUESTSOCIAL).DeleteOne(context.Background(), bson.D{{"_id", objectIDS}})
	if err != nil {
		fmt.Println(err)
	}
}

// UpdateSocialVotes updates votes
func UpdateSocialVotes(RequestedSocial models.RequestedSocial) {
	_, err := db.Collection(REQUESTSOCIAL).UpdateOne(
		context.Background(),
		bson.M{"_id": RequestedSocial.ID},
		bson.M{
			"$set": bson.M{
				"votes": RequestedSocial.Votes,
			},
		},
	)
	if err != nil {
		fmt.Println(err)
	}
}

// UpdateRequestedSocial updates votes
func UpdateRequestedSocial(RequestedSocial models.RequestedSocial) {
	_, err := db.Collection(REQUESTSOCIAL).UpdateOne(
		context.Background(),
		bson.M{"_id": RequestedSocial.ID},
		bson.M{
			"$set": RequestedSocial,
		},
	)
	if err != nil {
		fmt.Println(err)
	}
}

// PromoteSocialRequest updates votes
func PromoteSocialRequest(RequestedSocial models.RequestedSocial) {
	_, err := db.Collection(REQUESTSOCIAL).UpdateOne(
		context.Background(),
		bson.M{"_id": RequestedSocial.ID},
		bson.M{
			"$set": bson.M{
				"promoted": RequestedSocial.Promoted,
			},
		},
	)
	if err != nil {
		fmt.Println(err)
	}
}

//UpdateImageReqSocial update image
func UpdateImageReqSocial(RequestedSocial models.RequestedSocial) {
	_, err := db.Collection(REQUESTSOCIAL).UpdateOne(
		context.Background(),
		bson.M{"_id": RequestedSocial.ID},
		bson.M{
			"$set": bson.M{
				"photoUri": RequestedSocial.PhotoUri,
			},
		},
	)
	if err != nil {
		fmt.Println(err)
	}
}
