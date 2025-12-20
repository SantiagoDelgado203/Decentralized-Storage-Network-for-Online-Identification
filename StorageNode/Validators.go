/*
By Santiago Delgado, December 2025

Validators.go

This file will define validator types for the use of the DHT's Record's Store
*/

package main

//Only for testing
//
//Validator for records inputs under a custom prefix path.
//This validator will let ANYTHING get in the DHT
type LazyValidator struct{}

func (v LazyValidator) Validate(key string, value []byte) error {
	return nil
}

func (v LazyValidator) Select(key string, values [][]byte) (int, error) {
	return 1, nil
}
