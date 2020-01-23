class Card {
    public cardName: string;
    public bIsTheSolution: boolean;

    constructor(cardName: string, bIsTheSolution: boolean) {
        this.cardName = cardName;
        this.bIsTheSolution = bIsTheSolution;
    }
}