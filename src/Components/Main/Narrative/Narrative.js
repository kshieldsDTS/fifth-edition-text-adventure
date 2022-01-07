import React from 'react';
import Options from './Options/Options'
import { useState } from 'react'
import CombatModal from './CombatModal/CombatModal';

function Narrative(props) {
    const [enemyStats, setEnemyStats] = useState({});
	function fetchEnemy() {
		const url = 'https://www.dnd5eapi.co/api/monsters/orc';
		fetch(url)
			.then((res) => res.json())
			.then((res) => {
				const damageString = res.actions[0].damage[0].damage_dice;
				const numberOfDice = parseInt(damageString.slice(0, 1));
				const diceDamage = parseInt(damageString.slice(2, 4));
				setEnemyStats({
					nameLower: res.index,
					nameUpper: res.name,
					maxHP: parseInt(res.hit_points),
					currentHP: parseInt(res.hit_points),
					armorClass: parseInt(res.armor_class),
					minDamage: parseInt(numberOfDice),
					maxDamage: parseInt(numberOfDice * diceDamage),
					attackBonus: parseInt(res.actions[0].attack_bonus),
					damageBonus: parseInt(damageString.slice(-1)),
					active: true
				});
			});
	}
    return (
		<div className='narrative-container'>
			<div className='narrative'>
				<button onClick={fetchEnemy}>Fetch Orc</button>
				{enemyStats.active ? 
					<CombatModal 
						enemyStats={enemyStats}
						playerStats={props.playerStats}
						setEnemyStats={setEnemyStats}
						setPlayerStats={props.setPlayerStats}
						restartGame={props.restartGame}
					/> : null}
				{enemyStats.active ? null : 
					<p>{props.story[props.currentTextID].text}</p>}
				{enemyStats.active ? null :
				props.story[props.currentTextID].options.map((e, index) => {
					return (
						<Options
							key={`${props.story[props.currentTextID].id}${props.story[props.currentTextID].options[index].text}`}
							optionsText={props.story[props.currentTextID].options[index].text}
							nextID={props.story[props.currentTextID].options[index].nextID}
							text={props.story[props.currentTextID]}
							playerStats={props.playerStats}
							setPlayerStats={props.setPlayerStats}
							setCurrentTextID={props.setCurrentTextID}
						/>
					);
				})}
			</div>
		</div>
	);
}

export default Narrative;