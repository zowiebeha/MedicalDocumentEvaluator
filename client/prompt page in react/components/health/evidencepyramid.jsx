import React from 'react';

const pyramidLevels = [
  {
    name: 'Systematic Reviews',
    width: 'w-1/3',
    description: 'The highest level of evidence. These studies collect and critically analyze multiple research studies or papers on a specific topic, providing a comprehensive summary of the current evidence.'
  },
  {
    name: 'Randomized Controlled Trials',
    width: 'w-1/2',
    description: 'Considered the gold standard for clinical trials. Participants are randomly assigned to an experimental group or a control group to compare the effects of an intervention against a control.'
  },
  {
    name: 'Non-randomized Control Trials',
    width: 'w-2/3',
    description: 'Similar to RCTs but participants are not randomly assigned to groups. These are often used when randomization is not ethical or feasible.'
  },
  {
    name: 'Observational Studies with Comparison Groups',
    width: 'w-3/4',
    description: 'Researchers observe participants to assess health outcomes, comparing a group that received an exposure to one that did not. Examples include cohort studies and case-control studies.'
  },
  {
    name: 'Case Series & Reports',
    width: 'w-5/6',
    description: 'Collections of reports on the treatment of individual patients or a report on a single patient. They can be helpful for identifying new diseases or rare side effects but have no control group for comparison.'
  },
  {
    name: 'Expert Opinion',
    width: 'w-full',
    description: 'The lowest level of evidence. This is based on the personal experience and beliefs of an expert in the field. It is not based on scientific studies and is prone to bias.'
  }
];

export default function EvidencePyramid({ onLevelClick }) {
  return (
    <div className="flex flex-col items-center">
      {pyramidLevels.map((level, index) => (
        <div
          key={level.name}
          className={`${level.width} bg-gray-800 border-b border-gray-700 text-center p-3 cursor-pointer transition-all duration-300 hover:bg-blue-600 hover:scale-105 group`}
          style={{ clipPath: `polygon(${index * 5}% 0, ${100 - index * 5}% 0, 100% 100%, 0 100%)` }}
          onClick={() => onLevelClick(level)}
        >
          <span className="text-sm md:text-base font-medium text-white group-hover:text-white transition-colors">
            {level.name}
          </span>
        </div>
      ))}
    </div>
  );
}