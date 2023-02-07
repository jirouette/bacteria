import React, { useState } from "react";
import { Player } from "../../game";
import { HappyMood } from "./HappyMood";
import { NormalMood } from "./NormalMood";
import { SadMood } from "./SadMood";
import { TongueMood } from "./TongueMood";

interface Props {
    type: Player;
    playScore: number;
}

enum MoodType {
    NORMAL = 0,
    HAPPY,
    SAD,
    TONGUE
}

const LOW_PLAY_SCORE = [MoodType.SAD];
const NORMAL_PLAY_SCORE = [MoodType.TONGUE];
const BIG_PLAY_SCORE = [MoodType.HAPPY];

export function Mood({type, playScore}: Props) {
    const [mood, setMood] = useState(MoodType.NORMAL);

    const setMoodByCategory = (category: Array<MoodType>) => {
        if (! category.includes(mood)) {
            setMood(category[Math.floor(Math.random() * category.length)]);
        }
    }

    if (playScore > -1) {
        if (playScore <= 1) {
            setMoodByCategory(LOW_PLAY_SCORE);
        }
        else if (playScore <= 4) {
            setMoodByCategory(NORMAL_PLAY_SCORE);
        }
        else {
            setMoodByCategory(BIG_PLAY_SCORE);
        }
    }
    else if (mood != MoodType.NORMAL) {
        setMood(MoodType.NORMAL);
    }

    switch (mood) {
        case MoodType.NORMAL:
            return <NormalMood type={type} />;
        case MoodType.HAPPY:
            return <HappyMood type={type} />;
        case MoodType.SAD:
            return <SadMood type={type} />;
        case MoodType.TONGUE:
            return <TongueMood type={type} />;
    }
}
