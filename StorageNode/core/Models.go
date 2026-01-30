/*
By Santiago Delgado, January 2025

# Models.go

This file is to define all the models/structs used for data structure
*/

package core

type NewUserJSON struct {
	UID        string `json:"id"`
	UserCipher string `json:"u"`
	Key        string `json:"k"`
}
