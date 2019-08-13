package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

//TechTalk model
type TechTalk struct {
	ID             primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Topic          string             `json:"topic"`
	Presenter      string             `json:"presenter"`
	Location       string             `json:"location"`
	Date           string             `json:"date"`
	AdditionalInfo string             `json:"additionalInfo"`
	MobileNotify   bool               `json:"mobileNotify"`
	PhotoUri       string             `json:"photoUri"`
	CreatedAt      time.Time          `bson:"created_at" json:"created_at,omitempty"`
}

//SocialEvent model
type SocialEvent struct {
	ID             primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Place          string             `json:"place"`
	Location       string             `json:"location"`
	Date           string             `json:"date"`
	AdditionalInfo string             `json:"additionalInfo"`
	MobileNotify   bool               `json:"mobileNotify"`
	PhotoUri       string             `json:"photoUri"`
	CreatedAt      time.Time          `bson:"created_at" json:"created_at,omitempty"`
}

//RequestedSocial model
type RequestedSocial struct {
	ID             primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Place          string             `json:"place"`
	Location       string             `json:"location"`
	Votes          []string           `json:"votes"`
	AdditionalInfo string             `json:"additionalInfo"`
	Promoted       bool               `json:"promoted"`
	PhotoUri       string             `json:"photoUri"`
	CreatedAt      time.Time          `bson:"created_at" json:"created_at,omitempty"`
}

//RequestedTalk model
type RequestedTalk struct {
	ID             primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Topic          string             `json:"topic"`
	Presenter      string             `json:"presenter"`
	Date           string             `json:"date"`
	Votes          []string           `json:"votes"`
	AdditionalInfo string             `json:"additionalInfo"`
	Promoted       bool               `json:"promoted"`
	PhotoUri       string             `json:"photoUri"`
	CreatedAt      time.Time          `bson:"created_at" json:"created_at,omitempty"`
}

//ReportedIssue model
type ReportedIssue struct {
	ID primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Reporter string `json:"reporter"`
	Description string `json:"description"`
	Fixed bool `json:"fixed"`
	ReportedDate string `json:"reportedDate"`
	CreatedAt      time.Time          `bson:"created_at" json:"created_at,omitempty"`
}
