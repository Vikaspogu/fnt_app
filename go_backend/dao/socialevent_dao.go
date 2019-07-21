package dao

import (
	"context"
	"fmt"
	"go_backend/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	//SOCIALCOLL mongo collection
	SOCIALCOLL = "socialevent"
)

// InsertOneSocialEvent inserts one item from SocialEvent model
func InsertOneSocialEvent(SocialEvent models.SocialEvent) {
	_, err := db.Collection(SOCIALCOLL).InsertOne(context.Background(), SocialEvent)
	if err != nil {
		fmt.Println(err)
	}
}

// GetAllSocialEvents returns all techtalk from DB
func GetAllSocialEvents() []models.SocialEvent {
	cur, err := db.Collection(SOCIALCOLL).Find(context.Background(), bson.D{}, nil)
	if err != nil {
		fmt.Println(err)
	}
	var elements []models.SocialEvent
	var elem models.SocialEvent
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

// DeleteSocialEvent deletes an existing SocialEvent
func DeleteSocialEvent(SocialEventID string) {
	objectIDS, err := primitive.ObjectIDFromHex(SocialEventID)
	if err != nil {
		fmt.Printf("deleteTask: couldn't convert to-do ID from input: %v", err)
	}
	_, err = db.Collection(SOCIALCOLL).DeleteOne(context.Background(), bson.D{{"_id", objectIDS}})
	if err != nil {
		fmt.Println(err)
	}
}

// UpdateSocialEvent updates an existing SocialEvent
func UpdateSocialEvent(SocialEvent models.SocialEvent) {
	_, err := db.Collection(SOCIALCOLL).UpdateOne(
		context.Background(),
		bson.M{"_id": SocialEvent.ID},
		bson.M{
			"$set": SocialEvent,
		},
	)
	if err != nil {
		fmt.Println(err)
	}
}

//UpdateImageSocial update image
func UpdateImageSocial(SocialEvent models.SocialEvent) {
	_, err := db.Collection(SOCIALCOLL).UpdateOne(
		context.Background(),
		bson.M{"_id": SocialEvent.ID},
		bson.M{
			"$set": bson.M{
				"photoUri": SocialEvent.PhotoURI,
			},
		},
	)
	if err != nil {
		fmt.Println(err)
	}
}
