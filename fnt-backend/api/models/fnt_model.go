package models

import (
	"github.com/lib/pq"
	"time"
)

//TechTalk model
type TechTalk struct {
	ID 		 	   uint 		`gorm:"primary_key;auto_increment" json:"id"`
	Topic          string       `gorm:"size:255;not null;unique" json:"topic"`
	Presenter      string       `gorm:"size:255;not null" json:"presenter"`
	Location       string       `gorm:"size:255;not null" json:"location"`
	Date           string       `json:"date"`
	AdditionalInfo string       `json:"additionalInfo"`
	MobileNotify   bool         `json:"mobileNotify"`
	PhotoUri       string       `json:"photoUri"`
	CreatedAt 	   time.Time 	`gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt      time.Time 	`gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

//SocialEvent model
type SocialEvent struct {
	ID 		 	   uint 		`gorm:"primary_key;auto_increment" json:"id"`
	Place          string       `gorm:"size:255;not null;unique" json:"place"`
	Location       string       `gorm:"size:255;not null" json:"location"`
	Date           string       `json:"date"`
	AdditionalInfo string       `json:"additionalInfo"`
	MobileNotify   bool         `json:"mobileNotify"`
	PhotoUri       string       `json:"photoUri"`
	CreatedAt 	   time.Time 	`gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt      time.Time 	`gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

//RequestedSocial model
type RequestedSocial struct {
	ID 		 	   uint 		`gorm:"primary_key;auto_increment" json:"id"`
	Place          string       `gorm:"size:255;not null;unique" json:"place"`
	Location       string       `gorm:"size:255;not null" json:"location"`
	Votes          pq.StringArray     `gorm:"type:varchar(100)" json:"votes"`
	AdditionalInfo string       `json:"additionalInfo"`
	Promoted       bool         `json:"promoted"`
	PhotoUri       string       `json:"photoUri"`
	CreatedAt 	   time.Time 	`gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt      time.Time 	`gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

//RequestedTalk model
type RequestedTalk struct {
	ID 		 	   uint 		`gorm:"primary_key;auto_increment" json:"id"`
	Topic          string       `gorm:"size:255;not null;unique" json:"topic"`
	Presenter      string       `gorm:"size:255;not null" json:"presenter"`
	Date           string       `json:"date"`
	Votes          pq.StringArray     `gorm:"type:varchar(100)" json:"votes"`
	AdditionalInfo string       `json:"additionalInfo"`
	Promoted       bool         `json:"promoted"`
	PhotoUri       string       `json:"photoUri"`
	CreatedAt 	   time.Time 	`gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt      time.Time 	`gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

//ReportedIssue model
type ReportedIssue struct {
	ID 		 	  	uint 		`gorm:"primary_key;auto_increment" json:"id"`
	Reporter 		string 		`gorm:"size:255;not null" json:"reporter"`
	Description 	string 		`gorm:"size:255;not null" json:"description"`
	Fixed 			bool 		`json:"fixed"`
	ReportedDate 	time.Time 	`gorm:"default:CURRENT_TIMESTAMP" json:"reportedDate"`
	CreatedAt 	   	time.Time 	`gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt      	time.Time 	`gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}
