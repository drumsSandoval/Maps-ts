export interface PlacesResponse {
    type:        string;
    query:       string[];
    features:    Feature[];
    attribution: string;
}

export interface Feature {
    id:            string;
    type:          FeatureType;
    place_type:    PlaceType[];
    relevance:     number;
    properties:    Properties;
    text_es:       string;
    place_name_es: string;
    text:          string;
    place_name:    string;
    center:        number[];
    geometry:      Geometry;
    context:       Context[];
}

export interface Context {
    id:           string;
    text_es:      string;
    text:         string;
    wikidata?:    string;
    language_es?: Language;
    language?:    Language;
    short_code?:  string;
}

export enum Language {
    En = "en",
    Es = "es",
    Nl = "nl",
}

export interface Geometry {
    type:        GeometryType;
    coordinates: number[];
}

export enum GeometryType {
    Point = "Point",
}

export enum PlaceType {
    Address = "address",
}

export interface Properties {
    accuracy: Accuracy;
}

export enum Accuracy {
    Street = "street",
}

export enum FeatureType {
    Feature = "Feature",
}
