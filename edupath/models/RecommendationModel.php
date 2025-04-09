<?php
class RecommendationModel
{
    public static function recommendPrograms($interests)
    {
        $programsJson = file_get_contents(__DIR__ . '/../data/programs.json');
        if ($programsJson === false) return [];

        $programs = json_decode($programsJson, true);
        if (json_last_error() !== JSON_ERROR_NONE) return [];

        // Allow for multiple interests
        $interestList = array_map('trim', explode(',', $interests));

        $filteredPrograms = array_filter($programs, function ($program) use ($interestList) {
            foreach ($interestList as $interest) {
                if (
                    stripos($program['course_name'], $interest) !== false ||
                    stripos($program['category'] ?? '', $interest) !== false
                ) {
                    return true;
                }
            }
            return false;
        });

        return array_values($filteredPrograms);
    }
}
