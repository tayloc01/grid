package lib

import com.gu.mediaservice.lib.aws.{ThrallMessageSender, UpdateMessage}
import com.gu.mediaservice.lib.formatting._
import com.gu.mediaservice.model.{LeaseNotice, LeasesByMedia, MediaLease}
import org.joda.time.DateTime
import play.api.libs.json._

class LeaseNotifier(config: LeasesConfig, store: LeaseStore) extends ThrallMessageSender(config) {
  def sendReindexLeases(mediaId: String) = {
    val replaceImageLeases = "replace-image-leases"
    val leases = store.getForMedia(mediaId)
    val updateMessage = UpdateMessage(subject = replaceImageLeases, leases = Some(leases), id = Some(mediaId) )
    publish(updateMessage)
  }

  def sendAddLease(mediaLease: MediaLease) = {
    val addImageLease = "add-image-lease"
    val updateMessage = UpdateMessage(subject = addImageLease, mediaLease = Some(mediaLease), id = Some(mediaLease.mediaId), lastModified = Some(DateTime.now()))
    publish(updateMessage)
  }

  def sendAddLeases(mediaLeases: List[MediaLease], mediaId: String) = {
    val replaceImageLeases = "replace-image-leases"
    val updateMessage = UpdateMessage(subject = replaceImageLeases, leases = Some(mediaLeases), id = Some(mediaId), lastModified = Some(DateTime.now()))
    publish(updateMessage)
  }

  def sendRemoveLease(mediaId: String, leaseId: String) = {
    val removeImageLease = "remove-image-lease"

    val updateMessage = UpdateMessage(subject = removeImageLease, id = Some(mediaId),
      leaseId = Some(leaseId), lastModified = Some(DateTime.now())
    )
    publish(updateMessage)
  }
}
