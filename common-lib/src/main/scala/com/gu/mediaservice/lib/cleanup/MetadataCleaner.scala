package com.gu.mediaservice.lib.cleanup

import com.gu.mediaservice.lib.config.Company
import com.gu.mediaservice.model.ImageMetadata

trait MetadataCleaner {
  def clean(metadata: ImageMetadata): ImageMetadata
}

class MetadataCleaners(companies: List[Company]) {

  val attrCreditFromBylineCleaners = companies.map { company =>
    AttributeCreditFromByline(company.photographers, company.name)
  }

  val allCleaners: List[MetadataCleaner] = List(
    CleanRubbishLocation,
    StripCopyrightPrefix,
    BylineCreditReorganise,
    UseCanonicalGuardianCredit,
    ExtractGuardianCreditFromByline
  ) ++ attrCreditFromBylineCleaners ++ List(
    CountryCode,
    GuardianStyleByline,
    CapitaliseByline,
    InitialJoinerByline,
    CapitaliseCountry,
    CapitaliseState,
    CapitaliseCity,
    CapitaliseSubLocation,
    DropRedundantTitle,
    PhotographerRenamer
  )

  def clean(inputMetadata: ImageMetadata): ImageMetadata =
    allCleaners.foldLeft(inputMetadata) {
      case (metadata, cleaner) => cleaner.clean(metadata)
    }
}

// By vague order of importance:

// TODO: strip location+date prefix from description
// TODO: strip credit suffix from description
// TODO: strip (extract?) country + tags suffix from description

// TODO: strip (?) numbers or crappy acronyms as byline
// TODO: multiple country names (SWITZERLAND SCHWEIZ SUISSE, HKG, CHN) to clean name

// TODO: ignore crappy "keywords" (:rel:d:bm:LM1EAAO112401)

// TODO: unique keywords

// Ingested metadata:

// TODO: record Date Created or Date/Time Original
// TODO: ignore Unknown tags from fileMetadata

// TODO: artist (vs byline)?
