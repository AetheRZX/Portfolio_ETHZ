/* =====================================================================
   ALL TEXT ON THE SITE LIVES IN THIS FILE.

   - Edit text between the quotes / backticks. Simple HTML like <b>, <i>, <br>, <a href=""> works.
   - Anything written as [TODO: ...] shows up highlighted yellow. Replace them all before sharing.
   - Order of PROJECTS = order of cards on the home page. Add  hidden: true  to park a project.

   A project page is a free list of `sections` (no fixed template: use whatever tells the story).
   Each section can have:
     h:       heading
     text:    paragraph (use <br><br> for a paragraph break)
     media:   ["hero.mp4"] or ["a.png", "b.png"] (side by side). Files live in assets/<id>/.
     cols:    how many media per row (default: all in one row)
     narrow:  true to show a single figure smaller
     caption: small grey line under the media
     code:    { file: "algo.py", lang: "python", src: `...code...` }
   Missing files are skipped on the live site and shown as grey boxes on your own computer.
   ===================================================================== */

const PROFILE = {
  name: "Ryan Edric Nashota",
  fullName: "Ryan Edric Nashota",
  role: "", // optional second line of the headline, e.g. "a Robotics Engineer"
  intro: [
    "I'm an M.Sc. student in Robotics, Systems &amp; Control at ETH Zurich. My main interests are reinforcement learning, computer vision and motion planning, and I love building real robots.",
    "I'm looking for a Summer 2027 internship, so feel free to scroll down and see my past work.",
  ],
  email: "rnashota@student.ethz.ch",
  linkedin: "https://www.linkedin.com/in/ryan-edric-nashota/",
  github: "", // e.g. "https://github.com/yourname" (leave empty to hide)
  resume: "", // left empty on purpose: you send the resume yourself
};

const PROJECTS = [
  /* ================================================================== */
  {
    id: "nomadz",
    title: "Humanoid Skills for RoboCup: Video to Robot",
    year: "2026",
    tag: "Robot learning · NomadZ",
    links: [],
    intro: "With NomadZ, ETH's RoboCup humanoid team, I train reinforcement-learning controllers for the Booster K1 humanoid, from walking and kicking to whole-body motions learned from a video of a person, and deploy them on the robot.",
    sections: [
      { h: "A Humanoid That Plays Football", text: "", media: ["hero.mp4"], caption: "First hardware demo on the Booster K1." },
      {
        h: "Why Learn It",
        text: "Hand-scripted motions are not viable given the many sources of disturbance in a match. Thus, we used a learned policy for low level control which includes standing, walking, kicking, passing. The trained policy also has to be robust against disturbances but flexible enough to react to and manipulate the ball.",
      },
      {
        h: "From a Video to Robot Motion",
        text: "To teach the robot a new skill, I start from an ordinary video of a person. GVHMR reconstructs their 3D body motion, and GMR retargets it onto the K1's joints, whose proportions and joint limits are nothing like a human's. I then smooth the clip (354 frames, 11.8 s at 30 Hz) and screen it for foot sliding and self-collision before any GPU time goes into training. Below is an example motion that was trained, a tennis serve. Why tennis? Just to show that this is a general process that works for any motion.",
        media: ["tennis_check.mp4", "reference.mp4"],
        cols: 1,
        caption: "Top: the source video next to the 3D human motion reconstructed by GVHMR. Bottom: that motion retargeted onto the K1, a kinematic preview with no physics yet.",
      },
      {
        h: "Teaching a Policy to Follow It",
        text: "A PPO policy in Isaac Lab then learns to reproduce that reference under full physics, inertia, contacts, motor limits and all. The improvement from a quick smoke test (left video) to the fully trained policy (right video) shows how much of the skill is learned rather than copied.",
        media: ["smoke.mp4", "trained.mp4"],
        caption: "Left: smoke test after a few iterations. Right: trained policy after 10,000 iterations tracking the full motion.",
      },
      {
        h: "Kicking with Adversarial Motion Priors",
        text: "For running, dribbling and kicking I combine PPO with Adversarial Motion Priors. A discriminator rewards the robot for moving like human reference clips, so it learns a natural, stable kick instead of an odd motion that only works in simulation. The policies run on the robot through ROS 2 with vision feedback. Next up, I am training a passing skill in simulation before moving it to the real robot.",
      },
    ],
  },

  /* ================================================================== */
  {
    id: "teleop",
    title: "Four-Arm Handover: VR Teleoperation & Imitation Learning",
    year: "2026",
    tag: "Robot learning · ETH CVG",
    links: [],
    intro: "At ETH's Computer Vision and Geometry Group, I built a system where two operators wearing Meta Quest 3 headsets each control a bimanual robot station in Isaac Sim and hand objects to each other. I used it to collect 600+ demonstrations and train imitation-learning policies to do the handover on their own.",
    sections: [
      { h: "Teleoperation in Virtual Reality", text: "", media: ["hero.mp4"], caption: "Teleoperating Franka FR3 arms with ORCA dexterous hands in Isaac Sim through the Quest 3." },
      {
        h: "Why VR?",
        text: "The lab originally teleoperated the robots with Project Aria glasses. They track the operator's hands well, but give the operator no depth perception. It is hard to judge how far a cup is from the fingers, thus the grasping action missed, the objects get knocked over, and operators approach from awkward angles to compensate. Each demonstration took a long time to record, and many weren't worth training on (imitation learning copies whatever is in the data, hesitation and odd approach angles included).<br><br>Moving to a Meta Quest 3 in an Isaac Sim digital twin gives operators a stereo 3D view of the scene, so they reach and grasp naturally. Demonstrations became faster to collect and cleaner, which is what made collecting 600+ of them practical.",
      },
      {
        h: "The Task",
        text: "The robots have to perform a handover task. For instance, Station A picks up a teacup, basket or bowl and hands it over above the middle of the table. Station B takes it and places it within 5 cm of a matching goal disk. Objects and goals are randomized every episode. Each station records a scene camera plus both wrist cameras, and every demonstration is exported in LeRobot format.",
        media: ["demo.mp4"],
        caption: "A teleoperated demonstration: success in about 8 s.",
      },
      {
        h: "Training Policies",
        text: "After collecting human demonstrations, I moved on to imitation learning. I trained ACT, Diffusion Policy and SmolVLA on randomized object placements and replayed them in the simulated twin. Policy training is still a work in progress. There are many ways to split the problem, but currently I'm training one policy per station (one policy for two arms). Below is one that worked, a Diffusion Policy that re-plans every 8 steps, which made the first complete policy handover.",
        media: ["act.mp4", "diffusion_replan.mp4"],
        caption: "Left: ACT lifts the bowl 14 cm and passes it toward B, but drops it at about 10 s. Right: Diffusion Policy with re-planning makes the first real handover. B takes the bowl and sets it down 14 cm from its goal.",
      },
      {
        h: "Challenges",
        text: "Even my best policies don't yet place the object correctly, and that's because handover is one of the hardest settings for imitation learning. Four 7-DoF arms with 17-DoF hands give a 96-dimensional action space, and the two stations must agree on <i>when</i> to grasp and release without sharing a controller. The demonstrations are also multimodal, since every operator hands over slightly differently. I also tried large pretrained models, but they don't solve this out of the box either. SmolVLA, below, typically never even touches the object.",
        media: ["smolvla.mp4"],
        narrow: true,
        caption: "SmolVLA, the basket is never touched.",
      },
      {
        h: "What's Next",
        text: "Handover is a hard problem, but that's the fun of engineering, breaking a hard problem down and tackling it systematically.<br><br>I am in the process of implementing DAgger. Policies trained only on clean human demonstrations never see what recovering from a mistake looks like. Once a grasp is slightly off or the object starts to slip, like ACT's dropped bowl, the policy is in states it has never seen, and the robot gets confused. DAgger allows the policy to run, then the operator steps in through the headset whenever it drifts, and those corrections are added to the training data. The policy learns to recover from its own mistakes, not just to copy perfect runs, and the VR setup makes these interventions natural.<br><br>After that, I'll run a controlled study of how the two robots should share information, comparing one centralized policy for all four arms, independent per-station policies, per-station policies that see the partner's joint states, and one shared policy that exploits the stations' symmetry to double the data. I'm also running data-scaling curves (25 to 150 demonstrations), a five-object long-horizon variant, and adding π0.5.",
      },
    ],
  },

  /* ================================================================== */
  {
    id: "bldc",
    title: "Sensor-Error-Tolerant BLDC Motor Control",
    year: "2025–26",
    tag: "Embedded control · 2 IEEE papers",
    cover: "setup.svg",
    links: [
      { label: "GPECOM 2026 paper", url: "https://doi.org/10.1109/GPECOM70462.2026.11578798" },
      { label: "INFOTEH 2026 paper", url: "https://doi.org/10.1109/INFOTEH68759.2026.11477656" },
    ],
    intro: "Cheap brushless motors are everywhere, from e-bikes to robots, and so are their imperfections. In the Electric Power and Energy Systems Group at UBC, I built a controller that lets a low-cost BLDC motor run as if its Hall sensors were perfectly placed: balanced, efficient, and fast in transients. I modeled it in MATLAB/Simulink, wrote the firmware for a TI C2000 microcontroller, and validated it on hardware. The work led to two first-author IEEE papers.",
    sections: [
      { h: "Test Bench", text: "", media: ["setup.svg"], caption: "BLDC motor against a DC dynamometer with variable load, TI DRV8301 inverter board, DAQ and oscilloscope." },
      {
        h: "Hall Misalignment and Large Inductance Reduce Efficiency",
        text: "A Hall-sensor BLDC motor uses three Hall sensors, ideally 120° apart, to know when to switch phases. However, manufacturing tolerances cause these sensors to be misaligned, thus some commutation intervals become irregular (some longer, some shorter). The irregular commutation results in unbalanced phase currents, torque ripple and reduced efficiency.<br><br>Additionally, motors with large stator inductance add a second problem where the current lags the back-EMF, so part of it produces no torque at all (a non-zero d-axis current). Previous work had suggested using an averaging filter to smooth out the intervals but this approach adds a delay that makes the motor stall during fast acceleration.",
        media: ["phase_lag.svg"],
        narrow: true,
        caption: "With large inductance, the fundamental phase current lags the back-EMF by Δφ.",
      },
      {
        h: "A Cheap, Fast and Delay-Free Controller with a LUT",
        text: "The key idea for this controller is that the sensor misalignment is a fixed geometric error, so there is no need to filter it forever. During a short calibration (two to three electrical cycles), the firmware measures it and fills a lookup table with six correction angles and six sector durations. That's only 48 bytes in fixed point. At runtime, every Hall interrupt does a constant-time lookup and schedules the corrected commutation instant, with no filter delay.<br><br>On top of that, a PI controller continuously adjusts the commutation advance angle until the average d-axis current is zero. That is the Maximum Torque Per Ampere (MTPA) condition, where every amp goes into torque.",
        media: ["flowchart.svg"],
        caption: "Firmware: (a) PWM-rate task, (b) Hall interrupt that switches from calibration to LUT runtime, (c) scheduled commutation.",
      },
      {
        h: "Result",
        text: "The controller was validated using a commercial BLDC motor. As seen in the figure below, the commutation distortion (THD of the switching intervals) dropped from <b>13.64% to 5.33%</b>, matching the averaging filter performance (5.13%). This is good news because we are able to achieve similar performance without introducing significant delay. With the Hall correction and MTPA enabled, the average d-axis current converges to zero and the peak phase current drops for the same torque, raising motor efficiency from <b>89% to 93%</b>, cutting energy losses by more than a third, purely in firmware on the same low-cost motor.",
        media: ["thd.svg", "mtpa.svg"],
        caption: "Left: phase currents and harmonics for (a) uncompensated, (b) averaging filter, (c) LUT, (d) LUT with speed filter. Right: enabling MTPA drives the d-axis current to zero.",
      },
      {
        h: "Transient Study",
        text: "In simulation, the LUT was able to provide an instantaneous speed estimate which means we have a delay free controller. However, in the real world there are other disturbances and nonlinearities not captured in a Simulink model, so the LUT needs a light first-order speed filter (alpha filter) to get the instantaneous speed estimate. You can think of the alpha filter as a knob. Too little filtering lets ripple into the commutation timing, and too much brings the delay back.<br><br>In this study we show that by properly tuning α, with α = 0.6, the motor is able to get the best of both worlds. The motor has steady-state performance on par with the averaging filter, and a fast, smooth acceleration where the averaging filter visibly chokes as seen in the picture below.",
        media: ["transient.svg"],
        narrow: true,
        caption: "Speed response to a 10% → 100% duty step. The LUT (α = 0.6) accelerates smoothly. The averaging filter and heavy filtering (α = 0.1) choke.",
      },
    ],
  },

  /* ================================================================== */
  {
    id: "transformer",
    title: "Drive-and-Fly Transformer Robot",
    year: "2025–26",
    tag: "Mechatronics · UBC MECH 423",
    links: [],
    intro: "A robot that drives on four wheels, then folds its wheels up and spins propellers inside them. Inspired by Caltech's M4 Morphobot, it reuses the same four pods for both jobs, making it compact yet versatile. Two of us (me and my twin, Gyan E. Zesiro) designed and built it from scratch, including the airframe, gears, power electronics and a custom flight controller.",
    sections: [
      { h: "Watch It Transform", text: "", media: ["hero.mp4"], caption: "Servos rotate all four rotor-wheel pods 90° between driving and flying." },
      {
        h: "A Robot That Drives and Flies. A Flying Car!?",
        text: "From one radio transmitter the operator can drive with differential steering, switch modes, transform, and spin up the flight motors. The firmware keeps the two powertrains strictly exclusive. In drive mode the propellers are held off, and in fly mode the drive motors are held at neutral.",
        media: ["modes.mp4"],
        caption: "Bench demo of driving, transforming and flight-motor spin-up from the transmitter.",
      },
      {
        h: "Appendage Repurposing",
        text: "Each pod is a ducted propeller whose duct doubles as the wheel rim. Locked flat, it works like a normal wheel, driven through a gear ring by a separate drive motor. Tilted upright though, the same pod is now a rotor!",
        media: ["sketch_modes.jpg", "sketch_mechanism.jpg", "car_annotated.jpg", "drone_annotated.jpg"],
        cols: 2,
        caption: "From napkin sketch to the built robot, with the wheels, driving gears, propellers and servo arms labeled.",
      },
      {
        h: "Rotor-Wheel Pods",
        text: "Each pod houses an EMAX 2812 1100 KV motor with an 8-inch three-blade propeller inside a 3D-printed duct. The duct's outer rim carries the tire tread and a gear ring, and runs on a printed bearing. On the thrust bench, the bare motor and propeller made over 1 kg of thrust. With the duct and tread it dropped to about 850 g per pod, 3.4 kg in total for a 2.5 kg robot.",
        media: ["pod_exploded.jpg", "pod_cad.png"],
        caption: "Pod CAD with the printed bearing, the wheel rim with its gear ring and tread, and the motor cap.",
      },
      {
        h: "The Transformation Mechanism",
        text: "Holding a 0.3 kg pod on a 300 mm arm takes about 9 kg·cm of torque, and driving over bumps doubles the shock load. We used 35 kg·cm servos for a 2× margin so the gears don't strip, geared to the arm through large printed teeth. The arm support is shaped like a 3D-printer tree support, which is far lighter than a truss and still stiff. A full transformation takes about 10 s, half our 20 s target, and the joints showed no slop after repeated cycling.",
        media: ["servo_cad.jpg", "arm_annotated.jpg"],
      },
      {
        h: "A Frame Like a Bridge",
        text: "Carbon fiber delaminated when we cut it, so the frame is waterjet-cut 2 mm aluminum, perforated like a truss bridge to save weight while carrying the servos and two electronics decks. It even has feet, shaped like a penguin's, because like them it yearns to fly.",
        media: ["frame_cad.jpg", "frame_waterjet.jpg"],
      },
      {
        h: "Power Electronics",
        text: "A 6S LiPo (22.2 V) feeds a PM07 power module, which routes high current to a 4-in-1 55 A flight ESC and two 35 A drive ESCs. It also senses pack voltage and current. Buck converters step down to 8.4 V for the servos and 5 V for the logic. Each converter was verified on the bench (5.03 V and 8.38 V) before integration, and firmware battery readings track a multimeter within 0.2 V.",
        media: ["power_module.jpg", "esc_motors.jpg"],
      },
      {
        h: "A Flight Controller Written from Scratch",
        text: "Instead of an off-the-shelf flight controller, the firmware runs on a Teensy built on dRehmFlight. It reads a BNO055 IMU, parses 10 iBUS radio channels with a 100 ms failsafe, and runs an angle PID loop and motor mixer at 400 Hz. Flight motors are driven with OneShot125 pulses for low latency, and a mode state machine switches between differential drive and quadrotor control. A Python telemetry dashboard streams attitude, commands and battery state live.",
        media: ["imu.mp4"],
        caption: "Live IMU attitude streaming to the laptop dashboard as the robot is rotated by hand.",
      },
      {
        h: "Results",
        text: "Ground driving was the most polished mode. The robot held above 0.8 m/s over 15 m straights, turned smoothly with differential drive, and started from standstill without slipping on tile or concrete. Transformation was smooth and repeatable, and the power system held its rails under full motor load without a single brownout.",
        media: ["drive_mode.jpg", "flight_mode.jpg"],
        caption: "Final robot in drive mode (left) and flight mode (right).",
      },
      {
        h: "The Hard Part Is Flying",
        text: "On its first hover attempt the robot lifted off and held briefly, then tilted and crashed. The structure survived largely intact, but the heavy pods far out on the arms give it a much larger moment of inertia than a normal quadcopter, and the PID gains weren't yet tuned for that. Along the way we also burned two 4-in-1 ESCs, one to an underrated 10 V capacitor on a 22 V bus. The path to stable flight is clear. We need to retune the attitude loop for the high inertia (more damping), add fusing and bulk capacitance near each ESC, move the wiring onto a PCB, and lighten the pods.",
        media: ["electronics_bay.jpg"],
        narrow: true,
        caption: "The electronics bay, with the battery, 4-in-1 ESC and power module on top and the Teensy, IMU, receiver and 5 V buck below.",
      },
    ],
  },

  /* ================================================================== */
  {
    id: "subbots",
    title: "AUV Manipulation Systems, UBC Subbots",
    year: "2023–26",
    tag: "Underwater robotics · Team lead",
    links: [{ label: "Technical Design Report", url: "https://robonation.org/app/uploads/sites/4/2025/07/RS25_TDR_Univ-of-British-Columbia-Subbots.pdf" }],
    intro: "As Design Team Lead, I led 12 people building our autonomous underwater robot's torpedoes, soft gripper and droppers, contributing to a top-10 finish at the international RoboSub competition.",
    sections: [
      { h: "The Robot", text: "", media: ["hero.png"] },
      {
        h: "Torpedo Launcher",
        text: "The torpedoes have to leave the hull fast and straight enough to pass through a small target opening underwater. The launcher stores energy in a compressed spring and releases it on command, and I wrote the actuator firmware that fires it. Together with the new gripper and droppers, the manipulation systems take up 30% less space than before and raised our competition task score by 25%.",
        media: ["torpedo.mp4"],
        caption: "A torpedo firing test.",
      },
      {
        h: "Shaping the Torpedo with CFD",
        text: "Underwater, drag decides how far and how straight a torpedo flies. I ran CFD in ANSYS Fluent to see the pressure distribution around the body, which guided the shape of the nose and fins.",
        media: ["torpedo_cfd.png"],
        narrow: true,
        caption: "Static pressure contours around the torpedo body in ANSYS Fluent.",
      },
      {
        h: "A Concept That Didn't Make It",
        text: "Before settling on the spring launcher, I designed a barrel-cam launcher. It worked on paper, but it was simply too big for the space we had in the hull, so we went with the compact design.",
        media: ["barrel_cam.png"],
        narrow: true,
        caption: "The barrel-cam torpedo launcher concept.",
      },
      {
        h: "Two Jobs, One Module",
        text: "We wanted our actuators to be as compact as possible, so the newest claw has the dropper built right into its body. The same module grabs objects and releases markers onto targets, instead of carrying two separate mechanisms.",
        media: ["claw_dropper.png", "claw.mp4"],
        caption: "The combined claw and dropper (left) and the gripper mechanism in action (right).",
      },
      {
        h: "Soft Gripper Fingers",
        text: "Rigid fingers need precise alignment, and an underwater robot that is gently drifting rarely has it. So the claw uses soft fingers that wrap around whatever they grab, which makes grasping far more forgiving of position errors and odd shapes.<br><br>I made them myself. I designed the finger and its mold in CAD and 3D-printed the mold. Then, in the lab, I mixed a two-part PolyTek polyurethane rubber (Shore A 40), poured it into the mold, let it cure and demolded the finished fingers.",
        media: ["soft_finger.png"],
        narrow: true,
        caption: "CAD of the soft finger.",
      },
      {
        h: "Self-Powered Torpedo",
        text: "I also designed a torpedo that carries its own power. I sized the motor and supercapacitors, used reed switches to trigger it, and designed the charge and discharge circuit and its PCB.",
        media: ["circuit.png"],
        narrow: true,
        caption: "Charge and discharge circuit simulation.",
      },
      {
        h: "Perception for the Mission Planner",
        text: "I contributed to the ROS 2 mission planner, which uses object detection to find gates and targets underwater, and started a gripper that learns manipulation from teleoperation demonstrations (LeRobot, PyTorch).",
        media: ["yolo1.jpg", "yolo2.jpg"],
        caption: "YOLO detections of competition props.",
      },
      {
        h: "Leading the Team",
        text: "Looking back, leading this subteam was the most rewarding part of my time at Subbots. When I was still a junior member, we weren't the most motivated group on the team. We spent a lot of time talking about concepts that were never CADed, let alone built. When I took over as lead, and with a wave of motivated new members joining, that changed quickly. Within a year we had designed, built and improved every one of our actuators, and in the years after we kept coming up with novel ideas like the self-powered torpedo and the combined claw and dropper.<br><br>It's been a fun three years, and I'm grateful to my friends at UBC Subbots for so many amazing memories.",
      },
    ],
  },
  /* ================================================================== */
  {
    id: "dubins",
    title: "Dubins & Reeds-Shepp Path Planning for Car-like Robots",
    year: "2026",
    tag: "Motion planning · ETH",
    links: [],
    intro: "Why can a car parallel park even though it can't move sideways? And what is the shortest way to get from one pose to another when you can't turn in place? I implemented the classic geometric answers, Dubins and Reeds-Shepp paths, from scratch. This is the low-speed maneuvering layer of an autonomous car.",
    sections: [
      {
        h: "Planned Paths",
        text: "",
        media: ["dubins_grid.png"],
        caption: "Shortest forward-only paths between two poses. The blue arrow is the start and the green arrow is the goal.",
      },
      {
        h: "Problem Setup",
        text: "The car is a kinematic bicycle with state (x, y, θ). It can't slide sideways, and its tightest turn is set by the wheelbase L and maximum steering angle δ, giving r = L / tan δ. Given a start and a goal pose, the planner must return the shortest path that the car can actually drive. It has to arrive at the right position <i>and</i> facing the right way.<br><br>Before planning anything, I checked the model's controllability symbolically with Chow's theorem. The Lie bracket of \"drive\" and \"steer\" produces sideways motion, which is exactly why parallel parking is possible.",
      },
      {
        h: "Computing Dubins Paths",
        text: "Dubins proved that the shortest path is always at most three segments of maximum-curvature arcs and straight lines, either curve, straight, curve (like LSR) or three curves (like LRL). So the search collapses to geometry. Each pose gets a left and a right turning circle. I construct every valid tangent line between the start and goal circles, plus a third circle touching both for the three-arc case, then keep the shortest candidate. Signed radii let one formula handle all four left/right combinations, and degenerate cases (coincident or overlapping circles) are handled explicitly.",
        code: {
          file: "ex05/algo.py",
          lang: "python",
          src: `
def calculate_tangent_btw_circles(circle_start: Curve, circle_end: Curve) -> list[Line]:
    feasible_connectors = []
    displacement = circle_end.center.p - circle_start.center.p
    distance = float(np.linalg.norm(displacement))
    signed_r_start = circle_start.type.value * circle_start.radius
    signed_r_end = circle_end.type.value * circle_end.radius
    offset = signed_r_end - signed_r_start
    tolerance = 1e-12 * max(circle_start.radius, circle_end.radius, distance)

    if distance <= tolerance:
        if abs(offset) <= tolerance:  # same circle: zero-length connector
            pose = circle_start.start_config
            feasible_connectors.append(Line(pose, pose))
        return feasible_connectors

    # circles too close for this tangent type
    if distance < abs(offset) - tolerance:
        return feasible_connectors

    bearing = np.arctan2(displacement[1], displacement[0])
    heading = bearing - np.arcsin(np.clip(offset / distance, -1.0, 1.0))
    normal_left = np.array([-np.sin(heading), np.cos(heading)])
    start_point = circle_start.center.p - signed_r_start * normal_left
    end_point = circle_end.center.p - signed_r_end * normal_left

    feasible_connectors.append(Line(SE2Transform(start_point, heading), SE2Transform(end_point, heading)))
    return feasible_connectors`,
        },
      },
      {
        h: "Reeds-Shepp Paths",
        text: "Reeds-Shepp paths let the car switch between forward and reverse. Each segment gets a gear, and the planner may insert direction changes (cusps). Long forward loops collapse into short three-point maneuvers, exactly what you do in a tight parking spot.",
        media: ["reeds_grid.png"],
        caption: "Reeds-Shepp paths, where reversing makes tight reorientations far shorter.",
      },
      {
        h: "Spline Feasibility Check",
        text: "A smooth cubic spline between the same poses is often shorter and more comfortable, but the car can only follow it if its curvature never exceeds 1 / r. Rather than sampling points and hoping, I check this exactly. Speed and curvature are polynomials along the spline, so their extremes are found from polynomial roots, and zero-speed points (hidden cusps) are rejected.",
        media: ["spline.png"],
        narrow: true,
        caption: "Spline vs. Dubins between the same start and goal poses.",
      },
      {
        h: "Results",
        text: "Turning radius, turning circles, tangents, Dubins paths, Reeds-Shepp paths, spline feasibility and the controllability check passed every graded test, <b>7 of 7 categories at 100% accuracy</b>.",
      },
    ],
  },

  /* ================================================================== */
  {
    id: "planning",
    title: "Sampling-Based Motion Planning & Collision Checking",
    year: "2026",
    tag: "Motion planning · ETH",
    links: [],
    intro: "Before a robot can plan, it has to answer one question millions of times. Does this move hit anything? I built a mobile robot's planning core from the ground up, with exact collision checks, fast spatial indexing, a Probabilistic Roadmap, and RRT* with informed sampling.",
    sections: [
      {
        h: "Example Paths",
        text: "",
        media: ["rrt_grid.png"],
        caption: "RRT* paths from start (green) to goal (blue) around different obstacle layouts.",
      },
      {
        h: "Problem Setup",
        text: "A circular robot moves in a 2D workspace scattered with circles, triangles and arbitrary polygons. Every planner must return a path that is collision-free <i>along its whole length</i>, not just at its vertices. It is graded on correctness and on solve time, so a checker that is right but slow still loses.",
      },
      {
        h: "Collision Checking",
        text: "I wrote the geometric primitives first, meaning point, segment and circle tests against triangles and polygons, with the robot's radius folded into the geometry. Testing every path segment against every obstacle doesn't scale, so I implemented three faster ways to check a whole path.<br><br><b>Occupancy grid.</b> Rasterize the obstacles once, then check cells.<br><b>R-tree.</b> Index obstacle bounding boxes so each segment is tested only against nearby candidates.<br><b>Optimization-based.</b> Compute the minimum distance between shapes directly.<br><br>Paths are also checked in the robot's own frame after a rigid-body transform, as they would be on a real robot with onboard sensing.",
        media: ["collision_grid.png"],
        caption: "Path segments checked against mixed obstacles. Red crosses mark colliding segments.",
      },
      {
        h: "Probabilistic Roadmap (PRM)",
        text: "When one map serves many requests, it pays to build a roadmap. Free samples within a connection radius are linked by collision-free edges once, then Dijkstra answers each start-to-goal query on the shared graph.",
        media: ["prm.png"],
        narrow: true,
        caption: "One roadmap, three queries.",
      },
      {
        h: "RRT*",
        text: "RRT grows a tree toward random samples. RRT* adds two steps that make it asymptotically optimal. Each new node picks the cheapest collision-free parent nearby, then rewires its neighbours through itself whenever that lowers their cost, pushing the savings down the whole subtree. Once any path to the goal exists, I switch to informed sampling, where new samples come only from the ellipse of states that could still beat the current best, so no effort is wasted elsewhere. A final shortcut pass removes leftover zig-zags. Candidates are tried cheapest-first, so the expensive collision checks stop as soon as no better parent is possible.",
        code: {
          file: "ex06/sampling_planners.py",
          lang: "python",
          src: `
# Choose the cheapest collision-free parent among nearby nodes.
candidates = sorted(nearby.tolist(), key=lambda i: (costs[i] + distances[i], i))
for candidate in candidates:
    candidate_cost = float(costs[candidate] + distances[candidate])
    if candidate_cost >= new_cost:
        break
    if _edge_is_free(points[candidate], new_point, robot_radius, obstacles):
        parent, new_cost = candidate, candidate_cost
        break

# Rewire neighbours whose cost improves through the new node,
# then push the saving down to all of their descendants.
for neighbor in nearby.tolist():
    candidate_cost = new_cost + float(distances[neighbor])
    if candidate_cost + 1e-12 >= costs[neighbor]:
        continue
    if not _edge_is_free(new_point, points[neighbor], robot_radius, obstacles):
        continue
    improvement = candidate_cost - float(costs[neighbor])
    children[parents[neighbor]].remove(neighbor)
    parents[neighbor] = new_index
    children[new_index].add(neighbor)
    stack = [neighbor]
    while stack:
        descendant = stack.pop()
        costs[descendant] += improvement
        stack.extend(sorted(children[descendant]))`,
        },
      },
      {
        h: "Results",
        text: "Collision primitives, rigid-body transforms, all three path checkers, PRM and RRT* passed every graded test group, <b>7 of 7 at 100% accuracy</b>, with a weighted average solve time of 0.21 s.",
      },
    ],
  },

  /* ================================================================== */
  {
    id: "docking",
    title: "Autonomous Spaceship Docking",
    year: "2026",
    tag: "Trajectory optimization",
    links: [],
    intro: "A spaceship with a single steerable rear thruster, a limited fuel tank, planets in the way and asteroids drifting across its path. It has to arrive between the arms of a dock at the right position, angle and speed, and recover if something unexpected shoves it off course.",
    sections: [
      { h: "Example Run", text: "", media: ["hero.png"], narrow: true, caption: "In scenario 4, the red segment is flown during an external disturbance burst. The ship recovers and docks." },
      {
        h: "Problem Setup",
        text: "The ship has eight states (position, heading, two body-frame velocities, spin rate, nozzle angle and mass) and two inputs, thrust and the nozzle's turning rate. Thrust burns fuel in both directions, the nozzle angle and rate are bounded, and the velocities are capped. The score rewards docking without collision first, then penalizes time, path length, fuel use and computation time.",
      },
      {
        h: "Approach",
        text: "<b>1. A rough route.</b> A* finds a way around the inflated planets, and that route seeds the optimizer.<br><b>2. Optimize the real trajectory.</b> Successive convexification (SCvx) repeatedly linearizes the nonlinear dynamics around the current guess and solves a convex problem with trust regions. It finds the thrust profile and the arrival time together. Controls are first-order-hold between knots and integrated with RK4, with exact derivatives of the integrator.<br><b>3. Respect the real shape.</b> The hull is covered by overlapping discs, so the ship can slip through a dock opening that a single bounding circle would never fit. Asteroid positions are predicted along the plan's absolute time.<br><b>4. Track and re-plan.</b> A time-varying LQR follows the plan. The agent estimates external forces from its observations and re-plans from the measured state when errors grow.",
      },
      {
        h: "Results",
        text: "All four public scenarios reached the dock without collision, with an average score of <b>899</b>. On eight extra disturbance variants of the hardest scenario, every run docked safely (mean score 873). Every run also passed a physical-limit audit on thrust, nozzle angle, velocities and fuel.",
        media: ["trajectories.png"],
        caption: "Flown paths in the four public scenarios.",
      },
      {
        h: "Challenges and Fixes",
        text: "<b>Asteroids slipping between checks.</b> A fast asteroid could cross the ship between two collision-checked knots. I added constraints at the interval midpoints and a dense final check against the real hull polygon.<br><br><b>A nozzle that does nothing.</b> At zero thrust, turning the nozzle has no first-order effect, so the optimizer gets no useful gradient. Seeding with a small nonzero thrust profile fixed it.<br><br><b>Planning against the wrong asteroids.</b> After re-planning mid-flight, obstacle predictions must use absolute time (12 to 20 s), not the plan's own clock (0 to 8 s). Otherwise the ship avoids where the asteroids <i>were</i>.<br><br><b>Recovering from a late push.</b> A late disturbance burst left the ship inside its own safety margin, so the optimizer demanded an impossible jump. Recovery plans now start with a small margin that ramps back up over about 1.5 s, and restart from a neutral-nozzle guess. The dense hull check stays strict throughout.",
        media: ["diagnostics.png"],
        caption: "Scenario 4 diagnostics showing tracking errors, commands, fuel and the estimated disturbance (shaded).",
      },
    ],
  },

  /* ================================================================== */
  {
    id: "warehouse",
    title: "Multi-Robot Warehouse Coordination",
    year: "2026",
    tag: "Multi-robot planning · in progress",
    cover: "scenario_3.svg",
    links: [],
    intro: "A fleet of warehouse robots has to pick up packages and deliver them to drop-off points, without ever talking to each other once they start moving. Each robot only sees what its own short-range LiDAR can reach. <b>This project is in progress.</b> The problem and my planned approach are below, and simulation results are coming soon.",
    sections: [
      { h: "Scenario Map", text: "", media: ["scenario_3.svg"], narrow: true, caption: "The hardest official scenario, with 3 robots, 12 packages, 3 drop-off points and shelves in the way." },
      {
        h: "Problem Setup",
        text: "Each robot is a differential-drive base, steered only by its left and right wheel speeds. At the start, a global planner sees the whole map and may send each robot one message. After that, every robot is on its own. It gets new wheel commands every 0.1 s, sees only obstacles and other robots within a 5 m LiDAR range (partly blocked by shelves), and can't coordinate by radio.<br><br>The score makes the trade-offs explicit, with +100 per delivered package, −500 per collision, a bonus for finishing early, and penalties for distance, wheel effort, slow per-step computation (over 0.1 s) and slow global planning (over 60 s).",
      },
      {
        h: "Scenarios",
        text: "The official test maps range from a single robot clearing five packages to four robots sharing narrow aisles.",
        media: ["scenario_1.svg", "scenario_2.svg"],
        caption: "One robot with 5 packages and 2 drop-offs (left), and four robots with 6 packages and 2 drop-offs (right).",
      },
      {
        h: "Planned Approach",
        text: "<b>Global planning, once.</b> Assign packages to robots and order each robot's pickups and drop-offs, then plan routes on a roadmap of the free space. Because the robots can't talk later, conflicts must be resolved now, by staggering routes in time or reserving aisles.<br><br><b>Local control, every 0.1 s.</b> Each robot tracks its route and converts the desired forward and turning speed into wheel speeds. It avoids anything unexpected in its LiDAR view, and follows simple right-of-way rules so two robots meeting in an aisle never deadlock.",
      },
      {
        h: "Status",
        text: "In progress. Results, simulation videos and what I learned will be added here once the implementation is done.",
      },
    ],
  },
];

/* ------------------ Other projects (compact, below the main grid) ------------------
   Short entries with no project page. Optional picture: img: "file.png" (in assets/other/).
   Optional link: link: "https://..." */
const OTHER_PROJECTS = [
  {
    id: "scenegraph",
    img: "scenegraph.jpg",
    title: "Reliable Indoor Localization",
    where: "ETH Zurich · in progress",
    year: "2026",
    text: "Objects mapped from the same camera poses share errors, which makes localization overconfident. I'm extending SG2Loc with a compact model of that shared uncertainty, using Hydra scene graphs.",
  },
  {
    id: "swag",
    img: "swag.jpg",
    title: "Uncertainty-Aware Satellite Image Classification",
    where: "ETH Zurich · Probabilistic AI",
    year: "2026",
    text: "Bayesian deep learning with SWAG on a CNN. Averaging 30 sampled networks and calibrating confidence lets the model say \"don't know\" on snowy, cloudy or ambiguous images instead of guessing.",
  },
  {
    id: "policy",
    img: "policy.png",
    title: "Value & Policy Iteration",
    where: "ETH Zurich",
    year: "2026",
    text: "Solved stochastic grid-world MDPs with value and policy iteration, matching the ground-truth policy and value function on all 54 test cases.",
  },
  {
    id: "sindy",
    img: "sindy.png",
    title: "Sparse System Identification",
    where: "Independent study",
    year: "2025",
    text: "Recovered interpretable governing equations from data with SINDy and sparse regression, and used them for MPC and reduced-order modeling.",
  },
  {
    id: "bumps",
    img: "bumps.png",
    title: "Micron-Scale Bump Detection",
    where: "UBC Lubrication Lab",
    year: "2025",
    text: "Two-channel wavelet signal-processing pipeline that detects micron-scale bumps at a 90.2% F1 score in low SNR. Lab automation in LabVIEW and Python.",
  },
  {
    id: "spray",
    img: "spray.jpg",
    title: "Electrostatic Spray for Rail Friction Control",
    where: "UBC Applied Fluid Mechanics Lab",
    year: "2024",
    text: "Designed experiments that improved particle deposition efficiency by 50% and cut friction by 10%. Automated the analysis from one week to one day.",
  },
];

/* ------------------ About section (home page, below projects) ------------------ */
const EXPERIENCE = [
  { what: "Motion Control Team, NomadZ (RoboCup)", where: "ETH Zurich", when: "2026 – now" },
  { what: "Researcher, Computer Vision and Geometry Group", where: "ETH Zurich", when: "2026 – now" },
  { what: "Product Engineering Intern, Xergy Tech", where: "Vancouver", when: "2025 – 2026" },
  { what: "Technical Lead, Airbus Robotics capstone", where: "Vancouver", when: "2025 – 2026" },
  { what: "Researcher, Electric Power & Energy Systems Group", where: "UBC", when: "2025 – 2026" },
  { what: "Design Team Lead, UBC Subbots", where: "UBC", when: "2023 – 2026" },
  { what: "Researcher, Lubrication Lab", where: "UBC", when: "2025" },
  { what: "Researcher, Applied Fluid Mechanics Lab", where: "UBC", when: "2024" },
];

const EDUCATION = [
  { what: "M.Sc. Robotics, Systems and Control", where: "ETH Zurich", when: "2026 – 2028" },
  { what: "B.A.Sc. Mechanical Engineering (Mechatronics), Minor in Commerce", where: "University of British Columbia", when: "2022 – 2026" },
];

const PUBLICATIONS = [
  `<b>R. E. Nashota</b>, M. Phung, J. Jatskevich. "Microcontroller Implementation of Combined MTPA and LUT Correction of BLDC Motors with Large Stator Inductance and Hall Sensors Misalignment." <i>IEEE GPECOM</i>, 2026. <a href="https://doi.org/10.1109/GPECOM70462.2026.11578798">DOI</a>`,
  `<b>R. E. Nashota</b>, M. Phung, J. Jatskevich. "Improved MTPA Control of BLDC Motors with Large Stator Inductance and Hall Misalignment." <i>IEEE INFOTEH</i>, 2026. <a href="https://doi.org/10.1109/INFOTEH68759.2026.11477656">DOI</a>`,
  `<b>R. E. Nashota</b>, et al. RoboSub Technical Design Reports, RoboNation, 2024 &amp; 2025. <a href="https://robonation.org/app/uploads/sites/4/2025/07/RS25_TDR_Univ-of-British-Columbia-Subbots.pdf">2025 report</a>`,
];

const SKILLS = {
  "Control & robotics": "PID, LQR, MPC, SINDy, system identification, motion planning, computer vision, SLAM",
  "Robot learning": "RL (PPO, AMP), imitation learning (ACT, Diffusion Policy, π0.5), sim-to-real",
  "Software": "Python (PyTorch, NumPy, SciPy), C++, MATLAB / Simulink, ROS 2, Git",
  "Simulation": "Isaac Sim, LeRobot, Booster SDK, Gazebo, Meta Quest, Project Aria",
  "Embedded": "STM32, TI C2000, Teensy, Arduino, Siemens PLC, LabVIEW",
  "Hardware": "SolidWorks, ANSYS, Altium, PCB design, 3D printing, CNC, laser cutting, waterjet",
  "Languages": "English (fluent), Indonesian (native), Japanese (intermediate), German (A1)",
};
