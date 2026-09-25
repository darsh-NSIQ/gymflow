export interface ExerciseGuide {
  id: string
  name: string
  muscle_group: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Biceps' | 'Triceps' | 'Abs' | 'Calves' | 'Glutes'
  secondary_muscles: string[]
  equipment: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  gif_url: string
  video_url?: string
  execution_steps: string[]
  pro_tips: string[]
  common_mistakes: string[]
}

export const EXERCISE_DATABASE: Record<string, ExerciseGuide> = {
  'barbell bench press': {
    id: 'ex_bench_press',
    name: 'Barbell Bench Press',
    muscle_group: 'Chest',
    secondary_muscles: ['Front Deltoids', 'Triceps Brachii'],
    equipment: 'Olympic Barbell & Flat Bench',
    difficulty: 'Intermediate',
    gif_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=700&q=80',
    video_url: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    execution_steps: [
      'Lie flat on the bench with feet firmly planted on the floor and arch your lower back slightly.',
      'Grasp the barbell slightly wider than shoulder-width with a full grip.',
      'Unrack the bar and lower it with control to your mid-chest level.',
      'Press the barbell upwards explosively while driving through your feet until arms are extended.',
    ],
    pro_tips: [
      'Keep your shoulder blades retracted and depressed throughout the entire movement.',
      'Maintain a 45 to 60-degree angle between your elbows and torso to protect rotator cuffs.',
    ],
    common_mistakes: ['Bouncing the bar off the chest', 'Flaring elbows outward at a 90-degree angle', 'Lifting feet off the floor'],
  },
  'incline dumbbell press': {
    id: 'ex_incline_db_press',
    name: 'Incline Dumbbell Press',
    muscle_group: 'Chest',
    secondary_muscles: ['Upper Chest (Clavicular Head)', 'Front Delts', 'Triceps'],
    equipment: 'Incline Bench (30-45°) & Dumbbells',
    difficulty: 'Intermediate',
    gif_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=700&q=80',
    video_url: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
    execution_steps: [
      'Set the incline bench to a 30 to 45-degree angle.',
      'Sit down holding a dumbbell in each hand resting on your thighs.',
      'Kick the dumbbells up to chest height and press them straight up towards the ceiling.',
      'Lower the dumbbells slowly until you feel a full stretch across the upper chest, then squeeze up.',
    ],
    pro_tips: [
      'Do not set the bench higher than 45° to avoid shifting tension away from chest onto shoulders.',
      'Squeeze the dumbbells slightly inward at the top position.',
    ],
    common_mistakes: ['Setting bench too steep', 'Clanking dumbbells together at the top', 'Rushing the downward eccentric phase'],
  },
  'tricep rope pushdown': {
    id: 'ex_tricep_pushdown',
    name: 'Tricep Rope Pushdown',
    muscle_group: 'Triceps',
    secondary_muscles: ['Lateral & Medial Tricep Heads'],
    equipment: 'Cable Machine & Rope Attachment',
    difficulty: 'Beginner',
    gif_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=700&q=80',
    video_url: 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
    execution_steps: [
      'Attach a rope to the high pulley of a cable station.',
      'Grasp the rope with palms facing each other and lean forward slightly at the hips.',
      'Keep your elbows pinned tight against your ribs and push the rope down toward your thighs.',
      'At the bottom of the movement, spread the rope ends outward to maximize peak tricep contraction.',
    ],
    pro_tips: [
      'Isolate the triceps by keeping your upper arms motionless throughout the reps.',
      'Control the weight as it returns up to chest level.',
    ],
    common_mistakes: ['Allowing elbows to flare forward and back', 'Using body momentum/swinging', 'Partial range of motion'],
  },
  'lat pulldown': {
    id: 'ex_lat_pulldown',
    name: 'Lat Pulldown',
    muscle_group: 'Back',
    secondary_muscles: ['Latissimus Dorsi', 'Biceps', 'Rear Delts', 'Rhomboids'],
    equipment: 'Lat Pulldown Cable Station',
    difficulty: 'Beginner',
    gif_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&q=80',
    video_url: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    execution_steps: [
      'Adjust the thigh pad so your legs are firmly locked under the support.',
      'Grasp the wide bar with an overhand grip slightly wider than shoulder-width.',
      'Lean back slightly (about 10-15 degrees) and pull the bar down to your upper chest level.',
      'Pause at the bottom and squeeze your lats before slowly letting the bar rise.',
    ],
    pro_tips: [
      'Initiate the movement by driving your elbows down and back, not by pulling with your hands.',
      'Think about touching your elbows to your side pockets.',
    ],
    common_mistakes: ['Pulling the bar behind the neck', 'Leaning back excessively using lower back momentum', 'Shrugging shoulders up'],
  },
  'seated cable row': {
    id: 'ex_seated_cable_row',
    name: 'Seated Cable Row',
    muscle_group: 'Back',
    secondary_muscles: ['Rhomboids', 'Middle Trapezius', 'Lats', 'Biceps'],
    equipment: 'Seated Row Cable Machine & V-Bar',
    difficulty: 'Beginner',
    gif_url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=700&q=80',
    video_url: 'https://www.youtube.com/watch?v=GZbfZ033fBo',
    execution_steps: [
      'Sit on the bench with knees slightly bent and feet placed firmly on the footplates.',
      'Grasp the V-bar handles with a neutral grip and sit upright with a flat back.',
      'Pull the handle toward your abdomen while driving your shoulders back and squeezing shoulder blades.',
      'Slowly extend your arms back to the starting stretch position.',
    ],
    pro_tips: ['Keep your spine neutral and avoid rocking forward and backward excessively.'],
    common_mistakes: ['Rounding the lower back', 'Swinging torso for momentum', 'Bending wrists awkwardly'],
  },
  'ez bar bicep curl': {
    id: 'ex_ez_bicep_curl',
    name: 'EZ Bar Bicep Curl',
    muscle_group: 'Biceps',
    secondary_muscles: ['Biceps Brachii', 'Brachialis', 'Forearms'],
    equipment: 'EZ Curl Bar & Weight Plates',
    difficulty: 'Beginner',
    gif_url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=700&q=80',
    video_url: 'https://www.youtube.com/watch?v=kwG2ipFRgfo',
    execution_steps: [
      'Stand erect holding the EZ bar at the angled outer grip handles.',
      'Keep your elbows tucked close to your torso and wrists straight.',
      'Curl the bar upwards towards shoulder level by contracting your biceps.',
      'Pause for a peak squeeze at the top, then lower the bar under control.',
    ],
    pro_tips: ['The EZ bar reduces wrist and elbow strain compared to a straight barbell.'],
    common_mistakes: ['Swinging hips or using momentum', 'Allowing elbows to drift forward', 'Dropping the weight quickly'],
  },
  'barbell back squat': {
    id: 'ex_barbell_squat',
    name: 'Barbell Back Squat',
    muscle_group: 'Legs',
    secondary_muscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Core/Erectors'],
    equipment: 'Squat Rack & Olympic Barbell',
    difficulty: 'Advanced',
    gif_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=700&q=80',
    video_url: 'https://www.youtube.com/watch?v=ultWZbUMPL8',
    execution_steps: [
      'Step under the bar and rest it across your upper trapezius muscles.',
      'Unrack the bar and take two step-backs. Set feet shoulder-width apart with toes slightly turned out.',
      'Inhale deep into your diaphragm, push your hips back, and bend knees until thighs are parallel to the floor.',
      'Drive through your heels and mid-foot to stand back up, exhaling at the top.',
    ],
    pro_tips: [
      'Keep your chest up and eyes looking forward.',
      'Ensure knees track in line with your toes throughout the lift.',
    ],
    common_mistakes: ['Knees collapsing inward (valgus)', 'Curving lower back at bottom (butt wink)', 'Rising onto toes'],
  },
  'leg extension': {
    id: 'ex_leg_extension',
    name: 'Leg Extension',
    muscle_group: 'Legs',
    secondary_muscles: ['Quadriceps (Rectus Femoris, Vastus Lateralis/Medialis)'],
    equipment: 'Leg Extension Machine',
    difficulty: 'Beginner',
    gif_url: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=700&q=80',
    video_url: 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    execution_steps: [
      'Adjust the backrest so your knees align with the pivot point of the machine.',
      'Place your shins under the padded bar just above your ankles.',
      'Extend your legs upward until they are straight, flexing your quads intensely at the top.',
      'Lower the weight back down smoothly under tension.',
    ],
    pro_tips: ['Hold the peak contraction for 1 second at the top of every rep.'],
    common_mistakes: ['Using explosive jerking motion', 'Lifting buttocks off the seat'],
  },
  'hanging leg raise': {
    id: 'ex_leg_raise',
    name: 'Hanging Leg Raise',
    muscle_group: 'Abs',
    secondary_muscles: ['Rectus Abdominis', 'Lower Abs', 'Hip Flexors', 'Grip Strength'],
    equipment: 'Pull-up Bar',
    difficulty: 'Intermediate',
    gif_url: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=700&q=80',
    video_url: 'https://www.youtube.com/watch?v=hdng3Nm1x_E',
    execution_steps: [
      'Hang from a chin-up bar with an overhand grip and legs straight down.',
      'Engage your core and raise your legs forward until they are parallel to the floor (or higher).',
      'Pause briefly at the top squeeze position.',
      'Slowly lower your legs back to the starting vertical position without swinging.',
    ],
    pro_tips: ['Tilt your pelvis upward at the top to engage lower abs fully.'],
    common_mistakes: ['Swinging body back and forth', 'Using momentum instead of abdominal contraction'],
  },
  'barbell deadlift': {
    id: 'ex_deadlift',
    name: 'Barbell Deadlift',
    muscle_group: 'Back',
    secondary_muscles: ['Hamstrings', 'Glutes', 'Erector Spinae', 'Traps', 'Forearms'],
    equipment: 'Olympic Barbell & Bumper Plates',
    difficulty: 'Advanced',
    gif_url: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=700&q=80',
    video_url: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    execution_steps: [
      'Stand with feet hip-width apart and the barbell over your mid-foot.',
      'Hinge at the hips, bend knees, and grip the bar just outside your legs.',
      'Pull your chest up, engage your lats, and pull slack out of the bar.',
      'Drive through the floor with your legs, standing up tall and locking out hips at top.',
    ],
    pro_tips: ['Keep the bar in contact with your shins and thighs throughout the lift.'],
    common_mistakes: ['Rounding the lumbar spine', 'Hitching the bar up the thighs', 'Hyperextending lower back at top'],
  },
  'dumbbell lateral raise': {
    id: 'ex_lateral_raise',
    name: 'Dumbbell Lateral Raise',
    muscle_group: 'Shoulders',
    secondary_muscles: ['Side Deltoids (Lateral Head)', 'Trapezius'],
    equipment: 'Pair of Dumbbells',
    difficulty: 'Beginner',
    gif_url: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=700&q=80',
    video_url: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    execution_steps: [
      'Stand tall holding a dumbbell in each hand by your sides.',
      'Maintain a slight bend in your elbows and raise the dumbbells out to the sides until shoulder height.',
      'Pour slightly from pinkies at top as if pouring water from jugs.',
      'Lower the dumbbells slowly back to sides.',
    ],
    pro_tips: ['Lead with your elbows rather than your hands to target side delts.'],
    common_mistakes: ['Shrugging shoulders up to ears', 'Swinging torso for momentum', 'Lifting hands above elbows'],
  },
}

export function getExerciseGuide(exerciseName: string): ExerciseGuide {
  const normalized = exerciseName.toLowerCase().trim()

  // Match exact or fuzzy
  if (EXERCISE_DATABASE[normalized]) {
    return EXERCISE_DATABASE[normalized]
  }

  // Find best match in database
  const key = Object.keys(EXERCISE_DATABASE).find(
    (k) => normalized.includes(k) || k.includes(normalized)
  )

  if (key) {
    return EXERCISE_DATABASE[key]
  }

  // Fallback default guide
  return {
    id: `ex_${Date.now()}`,
    name: exerciseName,
    muscle_group: 'Chest',
    secondary_muscles: ['Synergist Muscles', 'Stabilizers'],
    equipment: 'Standard Gym Equipment',
    difficulty: 'Intermediate',
    gif_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=700&q=80',
    video_url: `https://www.youtube.com/results?search_query=${encodeURIComponent(exerciseName + ' form tutorial')}`,
    execution_steps: [
      'Position yourself with correct stance and grip on the exercise station.',
      'Engage your core and maintain a neutral spine posture.',
      'Execute the primary movement phase under full muscular control.',
      'Return to starting position with a controlled 2-3 second eccentric tempo.',
    ],
    pro_tips: [
      'Focus on the mind-muscle connection and full range of motion.',
      'Maintain steady breathing (exhale on exertion, inhale on return).',
    ],
    common_mistakes: ['Using excessive momentum', 'Rushing reps', 'Improper joint alignment'],
  }
}
