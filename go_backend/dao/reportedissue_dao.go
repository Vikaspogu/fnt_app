package dao

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go_backend/models"
)

const (
	//REPORTISSUE mongo collection
	REPORTISSUE = "reportedissue"
)

// InsertReportedIssue inserts one item from ReportedIssue model
func InsertReportedIssue(ReportedIssue models.ReportedIssue) {
	_, err := db.Collection(REPORTISSUE).InsertOne(context.Background(), ReportedIssue)
	if err != nil {
		fmt.Println(err)
	}
}

// GetAllReportedIssue returns all Requested Social from DB
func GetAllReportedIssue() []models.ReportedIssue {
	cur, err := db.Collection(REPORTISSUE).Find(context.Background(), bson.D{}, nil)
	if err != nil {
		fmt.Println(err)
	}
	var elements []models.ReportedIssue
	var elem models.ReportedIssue
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
	var _ = cur.Close(context.Background())
	return elements
}

// DeleteReportedIssue deletes an existing ReportedIssue
func DeleteReportedIssue(ReportedIssueID string) {
	objectIDS, err := primitive.ObjectIDFromHex(ReportedIssueID)
	if err != nil {
		fmt.Printf("deleteTask: couldn't convert to-do ID from input: %v", err)
	}
	_, err = db.Collection(REPORTISSUE).DeleteOne(context.Background(), bson.D{{"_id", objectIDS}})
	if err != nil {
		fmt.Println(err)
	}
}

// UpdateReportedIssue updates votes
func UpdateReportedIssue(ReportedIssue models.ReportedIssue) {
	_, err := db.Collection(REPORTISSUE).UpdateOne(
		context.Background(),
		bson.M{"_id": ReportedIssue.ID},
		bson.M{
			"$set": ReportedIssue,
		},
	)
	if err != nil {
		fmt.Println(err)
	}
}

// FixedReportedIssue updates votes
func FixedReportedIssue(ReportedIssue models.ReportedIssue) {
	_, err := db.Collection(REPORTISSUE).UpdateOne(
		context.Background(),
		bson.M{"_id": ReportedIssue.ID},
		bson.M{
			"$set": bson.M{
				"fixed": ReportedIssue.Fixed,
			},
		},
	)
	if err != nil {
		fmt.Println(err)
	}
}
