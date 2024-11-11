import { validateClaim, ClaimType, Ticket } from "./claimValidator"; // adjust the import based on your setup

describe("validateClaim", () => {
  const validTicket: Ticket = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15],
  ];

  it("should reject a claim if the ticket dimensions are incorrect", () => {
    const invalidTicket = [
      [1, 2, 3],
      [4, 5, 6, 7],
      [8, 9],
    ];
    expect(() =>
      validateClaim([1, 2, 3, 4, 5], invalidTicket, ClaimType.TopLine)
    ).toThrowError("Invalid ticket dimensions. Ticket must be 3x5.");
  });

  it("should reject a claim if fewer than 5 numbers have been announced", () => {
    expect(validateClaim([1, 2, 3, 4], validTicket, ClaimType.TopLine)).toBe(
      "Rejected"
    );
  });

  it("should accept a valid TopLine claim", () => {
    expect(validateClaim([1, 2, 3, 4, 5], validTicket, ClaimType.TopLine)).toBe(
      "Accepted"
    );
  });

  it("should reject a TopLine claim if not all numbers in the top row are announced", () => {
    expect(validateClaim([1, 2, 3, 4], validTicket, ClaimType.TopLine)).toBe(
      "Rejected"
    );
  });

  it("should accept a valid MiddleLine claim", () => {
    expect(
      validateClaim([6, 7, 8, 9, 10], validTicket, ClaimType.MiddleLine)
    ).toBe("Accepted");
  });

  it("should reject a MiddleLine claim if not all numbers in the middle row are announced", () => {
    expect(validateClaim([6, 7, 8, 9], validTicket, ClaimType.MiddleLine)).toBe(
      "Rejected"
    );
  });

  it("should accept a valid BottomLine claim", () => {
    expect(
      validateClaim([11, 12, 13, 14, 15], validTicket, ClaimType.BottomLine)
    ).toBe("Accepted");
  });

  it("should reject a BottomLine claim if not all numbers in the bottom row are announced", () => {
    expect(
      validateClaim([11, 12, 13, 14], validTicket, ClaimType.BottomLine)
    ).toBe("Rejected");
  });

  it("should reject a FullHouse claim if fewer than 15 numbers have been announced", () => {
    expect(
      validateClaim(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        validTicket,
        ClaimType.FullHouse
      )
    ).toBe("Rejected");
  });

  it("should accept a valid FullHouse claim with all 15 numbers announced", () => {
    const allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    expect(validateClaim(allNumbers, validTicket, ClaimType.FullHouse)).toBe(
      "Accepted"
    );
  });

  it("should accept a valid EarlyFive claim when at least five numbers on the ticket are announced", () => {
    expect(
      validateClaim([1, 6, 11, 2, 7], validTicket, ClaimType.EarlyFive)
    ).toBe("Accepted");
  });

  it("should reject an EarlyFive claim if fewer than five numbers on the ticket are announced", () => {
    expect(validateClaim([1, 6, 11, 2], validTicket, ClaimType.EarlyFive)).toBe(
      "Rejected"
    );
  });

  it("should reject any claim if the last announced number is not part of the winning sequence", () => {
    // TopLine claim where the last number is not in the top row
    expect(validateClaim([1, 2, 3, 4, 6], validTicket, ClaimType.TopLine)).toBe(
      "Rejected"
    );

    // FullHouse claim with the last number not in the ticket
    const allNumbersWrongLast = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 20,
    ];
    expect(
      validateClaim(allNumbersWrongLast, validTicket, ClaimType.FullHouse)
    ).toBe("Rejected");
  });
});
