import { showHUD } from "@raycast/api";
import { runAppleScript } from "@raycast/utils";

export default async function (reaction: string) {
  const mapping: object = {
    hearts: {
      group: 1,
      reaction: 1,
    },
    thumbsUp: {
      group: 1,
      reaction: 2,
    },
    thumbsDown: {
      group: 1,
      reaction: 3,
    },
    balloons: {
      group: 1,
      reaction: 4,
    },
    rain: {
      group: 2,
      reaction: 1,
    },
    confetti: {
      group: 2,
      reaction: 2,
    },
    lasers: {
      group: 2,
      reaction: 3,
    },
    fireworks: {
      group: 2,
      reaction: 4,
    },
  };

  const selectedReaction = mapping[reaction as keyof object];
  if (!selectedReaction) {
    return;
  }
  const res = await runAppleScript(
    `
set reaction to ` +
      selectedReaction["reaction"] +
      `
set reactionGroup to ` +
      selectedReaction["group"] +
      `

set foundAudioVideoControlMenuBarItem to false

tell application "System Events"

	tell its application process "ControlCenter"

		tell its menu bar 1

			repeat with menuBarItem in every menu bar item

				if description of menuBarItem is "Audio and Video Controls" then

					set foundAudioVideoControlMenuBarItem to true

					click menuBarItem

					set uiElementGroup to 1

					try
						tell application "System Events"
							click UI element 2 of group 1 of group 1 of window "Control Center" of application process "Control Center"
						end tell
					end try

					try
						tell application "System Events"
							click UI element 2 of group 2 of group 1 of window "Control Center" of application process "Control Center"
							set uiElementGroup to 2
						end tell
					end try

					try
						tell application "System Events"
							click UI element 2 of group 3 of group 1 of window "Control Center" of application process "Control Center"
							set uiElementGroup to 3
						end tell
					end try

					try
						tell application "System Events"
							click UI element 2 of group 4 of group 1 of window "Control Center" of application process "Control Center"
							set uiElementGroup to 4
						end tell
					end try

					delay 0.1

					tell application "System Events"
						click UI element reaction of group reactionGroup of group uiElementGroup of group 1 of window "Control Center" of application process "Control Center"
					end tell

					delay 0.1

					tell application "System Events"
						key code 53
					end tell

				end if

			end repeat

		end tell

	end tell

end tell

if foundAudioVideoControlMenuBarItem is false then

	tell me to activate
	set theDialogText to "The Audio Video Control menu bar item wasn't found. Make sure there is a running app that is actively using your camera."
	display dialog theDialogText buttons {"OK"} default button "OK" with title "MacOS Reactions for Raycast" giving up after 30

end if
`,
    ["world"],
  );
  await showHUD(res);
}
