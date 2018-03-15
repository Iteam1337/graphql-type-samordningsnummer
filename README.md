## Custom GraphQL scalar for swedish samordningsnummer

[As defined by the Swedish Tax Agency](https://www.skatteverket.se/foretagochorganisationer/myndigheter/informationsutbytemellanmyndigheter/folkbokforingsamordningsnummer.4.46ae6b26141980f1e2d3643.html)

Using the format: "19701063-2391" where the last digit is the luhn checksum of the previous 9 digits (that's without the millenum and century).

### Known caveats
* Validates that day of birth is between 1-31.

